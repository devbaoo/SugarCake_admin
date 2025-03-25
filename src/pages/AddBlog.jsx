import  { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import { deleteImage, uploadImage } from "../features/upload/uploadSlice";
import { IoMdClose } from "react-icons/io";
import { createBlog } from "../features/blogs/blogSlice";
import imageCompression from "browser-image-compression";

// Validation Schema for Add Blog Form
let userSchema = Yup.object().shape({
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  content: Yup.string().required("Content is Required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const AddBlog = () => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      images: [],
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      dispatch(createBlog(values));
      formik.resetForm();
      setImages([]);
      setTimeout(() => {
        navigate("/admin/blogs");
      }, 3000);
    },
  });


  const allImage = useSelector((state) => state.upload.images);
  const newState = useSelector((state) => state.blog);

  const { isSuccess, isError, isLoading, createdBlog } = newState;

  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, createdBlog]);

  const img = [];
  allImage.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });

  useEffect(() => {
    formik.values.images = img;
  }, [images, img, formik.values]);

  // Handle image drop and compression
  const handleDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      toast.error("You can only upload up to 5 images at a time.");
      return;
    }

    setIsUploading(true);

    try {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
          } catch (error) {
            console.error("Error compressing image:", error);
            return file;
          }
        })
      );

      const newImages = compressedFiles.map((file) => ({
        public_id: file.name,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);

      const response = await dispatch(uploadImage(compressedFiles)).unwrap();
      console.log("Upload response:", response);
      setIsUploading(false);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast.error("Failed to upload images.");
    }
  };

  return (
    <>
      <section>
        <form onSubmit={formik.handleSubmit} className="flex">
          <div className="my-6 mx-14 w-[80%]">
            <div>
              <h2 className="text-3xl font-medium">Tên bài viết</h2>
              <CustomInput
                className="w-full px-2 py-2 my-5 border rounded text-lg"
                type="text"
                placeholder="Nhập tên bài viết"
                name="title"
                val={formik.values.title}
                onChng={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
              />
              <div className="error">
                {formik.touched.title && formik.errors.title}
              </div>
            </div>

            <div className="my-5">
              <ReactQuill
                theme="snow"
                className="h-[500px]"
                placeholder="Viết mô tả bài viết ở đây"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange("content")}
              />
              <div className="error">
                {formik.touched.content && formik.errors.content}
              </div>
            </div>
          </div>

          <div className="my-6 mx-14 w-[20%]">
            <div>
              <h2 className="text-lg mb-2 font-medium">Hình ảnh bài viết</h2>
              <Dropzone onDrop={handleDrop} maxSize={1048576}>
                {({ getRootProps, getInputProps }) => (
                  <section className="border p-6 cursor-pointer rounded text-center">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Kéo và thả một số tệp ở đây, hoặc nhấp để chọn tệp</p>
                    </div>
                  </section>
                )}
              </Dropzone>
              {isUploading && <p>Uploading images...</p>}
            </div>

            <div className="flex gap-2 flex-wrap">
              {images.map((i, index) => (
                <div className="w-32 mb-3 relative" key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      setImages(
                        images.filter((_, imgIndex) => imgIndex !== index)
                      );
                      dispatch(deleteImage(i.public_id));
                    }}
                  >
                    <IoMdClose className="absolute top-5 right-2 text-white text-2xl cursor-pointer" />
                  </button>
                  <img src={i.url} alt="blog images" loading="lazy" />
                </div>
              ))}
            </div>

            <div>
              <button
                type="submit"
                className="bg-green-700 px-5 py-3 rounded text-white font-bold"
              >
                Thêm bài viết
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddBlog;
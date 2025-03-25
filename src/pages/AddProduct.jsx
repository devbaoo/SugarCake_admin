import  { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../features/category/categorySlice";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import { deleteImage, uploadImage } from "../features/upload/uploadSlice";
import { IoMdClose } from "react-icons/io";
import { createProducts } from "../features/products/productSlice";
import imageCompression from "browser-image-compression";

let userSchema = Yup.object().shape({
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  description: Yup.string().required("Description is Required"),
  price: Yup.number().required("Price is Required"),
  category: Yup.string().required("Thể loại là bắt buộc"),
  tags: Yup.string().required("Tag is Required"),
  quantity: Yup.number().required("Quantity is Required"),
});

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      tags: "",
      quantity: "",
      images: [],
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      dispatch(createProducts(values));
      formik.resetForm();
      setImages([]);
      setTimeout(() => {
        navigate("/admin/products");
      }, 3000);
    },
  });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const allCategory = useSelector((state) => state.category.category);
  const allImage = useSelector((state) => state.upload.images);
  const newState = useSelector((state) => state.product);

  const { isSuccess, isError, isLoading, createdProduct } = newState;

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, createdProduct]);

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
        <form onSubmit={formik.handleSubmit} action="#" className="flex">
          <div className="my-6 mx-14 w-[80%]">
            <div>
              <h2 className="text-3xl font-medium">Tên sản phầm </h2>
              <CustomInput
                className="w-full px-2 py-2 my-5 border rounded text-lg"
                type="text"
                placeholder="Nhập tên sản phẩm"
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
                placeholder="Viết mô tả sản phẩm của bạn ở đây"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange("description")}
              />
              <div className="error">
                {formik.touched.description && formik.errors.description}
              </div>
            </div>
          </div>
          <div className="my-6 mx-14 w-[20%]">
            <div className="mb-5">
              <div className="w-full">
                <label
                  htmlFor="categories"
                  className="block mb-2 text-lg font-bold text-gray-900"
                >
                  Chọn một danh mục
                </label>
                <select
                  name="category"
                  val={formik.values.category}
                  onChange={formik.handleChange("category")}
                  onBlur={formik.handleBlur("category")}
                  id="categories"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                  <option>Chọn một danh mục</option>
                  {allCategory.map((i, index) => {
                    return (
                      <option key={index} value={i.title}>
                        {i.title}
                      </option>
                    );
                  })}
                </select>
                <div className="error">
                  {formik.touched.category && formik.errors.category}
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="w-full">
                <label
                  htmlFor="categories"
                  className="block mb-2 text-lg font-bold text-gray-900"
                >
                  Chọn thẻ
                </label>
                <select
                  name="tags"
                  val={formik.values.tags}
                  onChange={formik.handleChange("tags")}
                  onBlur={formik.handleBlur("tags")}
                  id="tags"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                  <option value="">Chọn thẻ</option>
                  <option value="featured">Nổi bật</option>
                  <option value="popular">Phổ biến</option>
                  <option value="Special">Đặc biệt</option>
                </select>
                <div className="error">
                  {formik.touched.tags && formik.errors.tags}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg mb-2 font-medium">Hình ảnh sản phẩm</h2>
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
                  <img src={i.url} alt="product images" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="mb-5">
              <h2 className="text-lg font-medium">Giá</h2>
              <CustomInput
                className="w-full px-2 py-2 my-2 border rounded"
                type="number"
                placeholder="Nhập giá sản phẩm"
                name="price"
                val={formik.values.price}
                onChng={formik.handleChange("price")}
                onBlur={formik.handleBlur("price")}
              />
              <div className="error">
                {formik.touched.price && formik.errors.price}
              </div>
            </div>
            <div className="mb-5">
              <h2 className="text-lg font-medium">Số lượng</h2>
              <CustomInput
                className="w-full px-2 py-2 my-2 border rounded"
                type="number"
                placeholder="Nhập số lượng"
                name="quantity"
                val={formik.values.quantity}
                onChng={formik.handleChange("quantity")}
                onBlur={formik.handleBlur("quantity")}
              />
              <div className="error">
                {formik.touched.quantity && formik.errors.quantity}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-700 px-5 py-3 rounded text-white font-bold"
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProduct;

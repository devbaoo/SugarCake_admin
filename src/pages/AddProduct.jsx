import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brands/brandSlice";
import { getCategory } from "../features/category/categorySlice";
import { toast } from "react-toastify";
import { Select } from "antd";
import { getColors } from "../features/color/colorSlice";
import Dropzone from "react-dropzone";
import { deleteImage, uploadImage } from "../features/upload/uploadSlice";
import { IoMdClose } from "react-icons/io";
import { createProducts } from "../features/products/productSlice";

let userSchema = Yup.object().shape({
	title: Yup.string().required("Tiêu đề là bắt buộc"),
	description: Yup.string().required("Description is Required"),
	price: Yup.number().required("Price is Required"),
	brand: Yup.string().required("Brand is Required"),
	category: Yup.string().required("Thể loại là bắt buộc"),
	tags: Yup.string().required("Tag is Required"),
	color: Yup.array()
		.min(1, "Please pick at least one color")
		.required("Color is Required"),
	quantity: Yup.number().required("Quantity is Required"),
});

const AddProduct = () => {
	const [color, setColor] = useState();
	const [images, setImages] = useState();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
			price: "",
			brand: "",
			category: "",
			tags: "",
			color: "",
			quantity: "",
			images: "",
		},
		validationSchema: userSchema,
		onSubmit: (values) => {
			dispatch(createProducts(values));
			formik.resetForm();
			setColor(null);
			setImages(null);
			setTimeout(() => {
				navigate("/admin/products");
			}, 3000);
		},
	});

	useEffect(() => {
		dispatch(getBrands());
		dispatch(getCategory());
		dispatch(getColors());
	}, [dispatch]);
	const allBrands = useSelector((state) => state.brand.brands);
	const allCategory = useSelector((state) => state.category.category);
	const allColors = useSelector((state) => state.color.colors);
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

	const colorOptions = [];
	allColors.forEach((i) => {
		colorOptions.push({
			label: i.title,
			value: i.title,
		});
	});
	const handleColor = (e) => {
		setColor(e);
	};
	const img = [];
	allImage.forEach((i) => {
		img.push({
			public_id: i.public_id,
			url: i.url,
		});
	});

	useEffect(() => {
		formik.values.color = color ? color : " ";
		formik.values.images = img;
	}, [images, color, img, formik.values]);

	return (
		<>
			<section>
				<form
					onSubmit={formik.handleSubmit}
					action='#'
					className='flex'>
					<div className='my-6 mx-14 w-[80%]'>
						<div>
							<h2 className='text-3xl font-medium'>
								Tên sản phầm{" "}
							</h2>
							<CustomInput
								className='w-full px-2 py-2 my-5 border rounded text-lg'
								type='text'
								placeholder='Nhập tên sản phẩm'
								name='title'
								val={formik.values.title}
								onChng={formik.handleChange("title")}
								onBlur={formik.handleBlur("title")}
							/>
							<div className='error'>
								{formik.touched.title && formik.errors.title}
							</div>
						</div>

						<div className='my-5'>
							<ReactQuill
								theme='snow'
								className='h-[500px]'
								placeholder='Viết mô tả sản phẩm của bạn ở đây'
								name='description'
								value={formik.values.description}
								onChange={formik.handleChange("description")}
							/>
							<div className='error'>
								{formik.touched.description &&
									formik.errors.description}
							</div>
						</div>
					</div>
					<div className='my-6 mx-14 w-[20%]'>
						<div className='mb-5'>
							<div className='w-full'>
								<label
									htmlFor='categories'
									className='block mb-2 text-lg font-bold text-gray-900'>
									Chọn một danh mục
								</label>
								<select
									name='category'
									val={formik.values.category}
									onChange={formik.handleChange("category")}
									onBlur={formik.handleBlur("category")}
									id='categories'
									className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '>
									<option>Chọn một danh mục</option>
									{allCategory.map((i, index) => {
										return (
											<option key={index} value={i.title}>
												{i.title}
											</option>
										);
									})}
								</select>
								<div className='error'>
									{formik.touched.category &&
										formik.errors.category}
								</div>
							</div>
						</div>
						<div className='mb-5'>
							<div className='w-full'>
								<label
									htmlFor='categories'
									className='block mb-2 text-lg font-bold text-gray-900'>
									Chọn thẻ
								</label>
								<select
									name='tags'
									val={formik.values.tags}
									onChange={formik.handleChange("tags")}
									onBlur={formik.handleBlur("tags")}
									id='tags'
									className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '>
									<option value=''>Chọn thẻ</option>
									<option value='featured'>Nổi bật</option>
									<option value='popular'>Phổ biến</option>
									<option value='Special'>Đặc biệt</option>
								</select>
								<div className='error'>
									{formik.touched.tags && formik.errors.tags}
								</div>
							</div>
						</div>

						<div>
							<h2 className='text-lg mb-2 font-medium'>
							Hình ảnh sản phẩm
							</h2>
							<Dropzone
								onDrop={(acceptedFiles) =>
									dispatch(uploadImage(acceptedFiles))
								}>
								{({ getRootProps, getInputProps }) => (
									<section className='border p-6 cursor-pointer rounded text-center'>
										<div {...getRootProps()}>
											<input {...getInputProps()} />
											<p>
											Kéo và thả một số tệp ở đây,
											hoặc nhấp để chọn tệp
											</p>
										</div>
									</section>
								)}
							</Dropzone>
						</div>
						<div className='flex gap-2 flex-wrap'>
							{allImage.map((i, index) => {
								return (
									<div
										className='w-32 mb-3 relative'
										key={index}>
										<button
											type='button'
											onClick={() =>
												dispatch(
													deleteImage(i.public_id)
												)
											}>
											<IoMdClose className='absolute top-5 right-2 text-white text-2xl cursor-pointer' />
										</button>
										<img src={i.url} alt='product images' />
									</div>
								);
							})}
						</div>
						<div className='mb-5'>
							<h2 className='text-lg font-medium'>Giá</h2>
							<CustomInput
								className='w-full px-2 py-2 my-2 border rounded'
								type='number'
								placeholder='Nhập giá sản phẩm'
								name='price'
								val={formik.values.price}
								onChng={formik.handleChange("price")}
								onBlur={formik.handleBlur("price")}
							/>
							<div className='error'>
								{formik.touched.price && formik.errors.price}
							</div>
						</div>
						<div className='mb-5'>
							<h2 className='text-lg font-medium'>Số lượng</h2>
							<CustomInput
								className='w-full px-2 py-2 my-2 border rounded'
								type='number'
								placeholder='Nhập số lượng'
								name='quantity'
								val={formik.values.quantity}
								onChng={formik.handleChange("quantity")}
								onBlur={formik.handleBlur("quantity")}
							/>
							<div className='error'>
								{formik.touched.quantity &&
									formik.errors.quantity}
							</div>
						</div>
						<div>
							<button
								type='submit'
								className='bg-green-700 px-5 py-3 rounded text-white font-bold'>
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

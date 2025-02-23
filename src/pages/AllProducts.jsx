// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import CustomModel from "../components/CustomModel";

const columns = [
	{
		title: "S No.",
		dataIndex: "key",
	},
	{
		title: "Name",
		dataIndex: "title",
		sorter: (a, b) => a.title.length - b.title.length,
	},
	{
		title: "Price",
		dataIndex: "price",
		sorter: (a, b) => a.price.length - b.price.length,
	},
	{
		title: "Category",
		dataIndex: "category",
		sorter: (a, b) => a.category.length - b.category.length,
	},
	{
		title: "Quantity",
		dataIndex: "quantity",
	},
	{
		title: "Sold",
		dataIndex: "sold",
	},
	{
		title: "Ratings",
		dataIndex: "totalRating",
		sorter: (a, b) => a.totalRating.length - b.totalRating.length,
	},
	{
		title: "Action",
		dataIndex: "action",
	},
];

const AllProducts = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getProducts());
	}, [dispatch]);

	const totalProduct = useSelector((state) => state.product.products);
	const totalProducts = [...totalProduct].reverse();
	const data = [];
	for (let i = 0; i < totalProducts.length; i++) {
		if (totalProducts) {
			data.push({
				key: i + 1,
				title: totalProducts[i].title,
				description: totalProducts[i].description,
				price: `${totalProducts[i].price} VND`,
				category: totalProducts[i].category,
				quantity: totalProducts[i].quantity,
				sold: totalProducts[i].sold,
				totalRating: totalProducts[i].totalRating,
				action: (
					<>
						<div className='flex gap-3'>
							<Link className='text-lg'>
								<FaEdit />
							</Link>
							<button
								onClick={() => showModal(totalProducts[i]._id)}
								className='text-xl border-0 bg-transparent'>
								<MdDeleteOutline />
							</button>
						</div>
					</>
				),
			});
		}
	}

	const [open, setOpen] = useState(false);
	const [productId, setProductId] = useState("");
	const showModal = (e) => {
		setOpen(true);
		setProductId(e);
	};

	const hideModal = () => {
		setOpen(false);
	};

	const deleteProductData = (e) => {
		setOpen(false);
		dispatch(deleteProduct(e));

		setTimeout(() => {
			dispatch(getProducts());
		}, 200);
	};
	return (
		<>
			<div className='my-5'>
				<h2 className='text-xl my-4 font-bold'>Tất cả sản phẩm</h2>
				<Table columns={columns} dataSource={data} />
			</div>
			<CustomModel
				hideModal={hideModal}
				open={open}
				btnAction={() => {
					deleteProductData(productId);
				}}
				title='Bạn có chắc chắn muốn xóa Sản phẩm này không?'
			/>
		</>
	);
};

export default AllProducts;

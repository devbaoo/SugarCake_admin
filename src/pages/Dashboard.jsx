// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/auth/authSlice";
import { getUsers } from "../features/customers/customerSlice";
import Customers from "./Customers";
import { FcSalesPerformance } from "react-icons/fc";
import { RiCustomerService2Line } from "react-icons/ri";
import { HiMiniReceiptPercent } from "react-icons/hi2";
import { FaSellsy } from "react-icons/fa";
import { FaSitemap } from "react-icons/fa6";
import { getProducts } from "../features/products/productSlice";

const columns = [
	{
		title: "S No.",
		dataIndex: "key",
	},
	{
		title: "Order ID",
		dataIndex: "_id",
	},
	{
		title: "User Name",
		dataIndex: "name",
		sorter: (a, b) => a.name.length - b.name.length,
	},
	{
		title: "Product",
		dataIndex: "product",
	},
	{
		title: "Status",
		dataIndex: "orderStatus",
	},
	{
		title: "Product ID",
		dataIndex: "productId",
	},
	{
		title: "Ammount",
		dataIndex: "ammount",
		sorter: (a, b) => a.ammount.length - b.ammount.length,
	},
	{
		title: "Date",
		dataIndex: "date",
	},
];

const Dashboard = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getOrders());
		dispatch(getUsers());
		dispatch(getProducts());
	}, [dispatch]);

	const totalOrders = useSelector((state) => state.auth?.orders);
	const getAllOrders = [...totalOrders].reverse();
	const getAllCustomers = useSelector((state) => state.customer?.customers);
	const totalProduct = useSelector((state) => state.product.products);

	const data = [];
	for (let i = 0; i < getAllOrders?.length; i++) {
		if (getAllOrders) {
			data.push({
				key: i + 1,
				_id: getAllOrders[i]?._id,
				name: getAllOrders[i]?.shippingInfo?.name,
				product: getAllOrders[i]?.orderItems?.map((i, index) => {
					return <p key={index}>{i?.product?.title}</p>;
				}),
				productId: getAllOrders[i]?.orderItems?.map((i, index) => {
					return <p key={index}>{i?.product?._id}</p>;
				}),
				id: getAllOrders[i]?.paymentInfo?.razorpayPaymentId,
				ammount: `${getAllOrders[i]?.priceAfterDiscount} VND`,
				orderStatus: getAllOrders[i]?.orderStatus,
				date: new Date(getAllOrders[i]?.createdAt).toLocaleString(),
			});
		}
	}
	let totalOrdersAmount = 0;

	getAllOrders.forEach((items) => {
		totalOrdersAmount += items?.priceAfterDiscount;
	});
	return (
		<>
			<h2 className='text-xl font-bold'>Thống kê</h2>
			<section>
				<div className='flex justify-center items-center gap-10 my-8'>
					<div className='w-[20%] shadow-lg border rounded flex justify-center gap-10 items-center'>
						<div>
							<FcSalesPerformance size={40} />
						</div>
						<div>
							<p className='my-5 text-gray-400'>Tổng doanh thu</p>
							<h3 className='text-2xl text-green-700 font-bold my-5'>
								{`${totalOrdersAmount} VND`}
							</h3>
						</div>
					</div>
					<div className='w-[20%] shadow-lg border rounded flex justify-center gap-10 items-center'>
						<div>
							<HiMiniReceiptPercent size={40} />
						</div>
						<div>
							<p className='my-5 text-gray-400'>
							Giá trị đơn hàng trung bình
							</p>
							<h3 className='text-2xl font-bold text-green-700 my-5'>
								{`${Math.floor(
									totalOrdersAmount / getAllOrders?.length
								)} VND`}
							</h3>
						</div>
					</div>
					<div className='w-[20%] shadow-lg border rounded flex justify-center gap-10 items-center'>
						<div>
							<FaSellsy size={40} />
						</div>
						<div className='text-center'>
							<p className='my-5 text-gray-400'>Tổng số đơn hàng</p>
							<h3 className='text-2xl text-green-700 font-bold my-5'>
								{getAllOrders?.length}
							</h3>
						</div>
					</div>
					<div className='w-[20%] shadow-lg border rounded flex justify-center gap-10 items-center'>
						<div>
							<RiCustomerService2Line size={40} />
						</div>
						<div className='text-center'>
							<p className='my-5  text-gray-400'>
							Tổng số khách hàng
							</p>
							<h3 className='text-2xl text-green-700 font-bold my-5'>
								{getAllCustomers?.length}
							</h3>
						</div>
					</div>
					<div className='w-[20%] shadow-lg border rounded flex justify-center gap-10 items-center'>
						<div>
							<FaSitemap size={40} />
						</div>
						<div className='text-center'>
							<p className='my-5 text-gray-400'>Tổng sản phẩm</p>
							<h3 className='text-2xl text-green-700 font-bold my-5'>
								{totalProduct?.length}
							</h3>
						</div>
					</div>
				</div>
				<div className='my-5'>
					<h2 className='text-xl mb-2 font-bold'>Đơn hàng gần đây</h2>
					<Table columns={columns} dataSource={data} />
				</div>
				<div className='my-5'>
					<Customers />
				</div>
			</section>
		</>
	);
};

export default Dashboard;

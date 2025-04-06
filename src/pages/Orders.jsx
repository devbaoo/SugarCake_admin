import { useEffect } from "react";
import { Table, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, exportOrders } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";

const Orders = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getOrders());
	}, [dispatch]);

	const handleExport = () => {
		dispatch(exportOrders());
	};

	const getStatusBadge = (status) => {
		let color = "";
		switch (status) {
			case "Ordered":
				color = "bg-blue-100 text-blue-600";
				break;
			case "Processing":
				color = "bg-yellow-100 text-yellow-700";
				break;
			case "Dispatched":
				color = "bg-indigo-100 text-indigo-700";
				break;
			case "Delivered":
				color = "bg-green-100 text-green-600";
				break;
			case "Cancelled":
				color = "bg-red-100 text-red-600";
				break;
			default:
				color = "bg-gray-100 text-gray-600";
		}
		return (
			<span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
				{status}
			</span>
		);
	};

	const userAllOrders = useSelector((state) => state.auth?.orders);
	const getAllOrders = [...userAllOrders].reverse();

	const data = [];
	for (let i = 0; i < getAllOrders?.length; i++) {
		if (getAllOrders) {
			data.push({
				key: i + 1,
				_id: getAllOrders[i]?._id,
				name: getAllOrders[i]?.shippingInfo?.name,
				product: getAllOrders[i]?.orderItems?.map((i, index) => (
					<p key={index}>{i?.product?.title}</p>
				)),
				ammount: `${getAllOrders[i]?.priceAfterDiscount.toLocaleString("vi-VN")} VND`,
				orderStatus: getStatusBadge(getAllOrders[i]?.orderStatus), // ✅ dùng badge màu
				date: new Date(getAllOrders[i]?.createdAt).toLocaleDateString("vi-VN"),
				action: (
					<div className='flex gap-3'>
						<Link to={`/admin/order/${getAllOrders[i]?._id}`} className='text-lg'>
							<IoMdEye />
						</Link>
					</div>
				),
			});
		}
	}

	const columns = [
		{ title: "S No.", dataIndex: "key" },
		{ title: "Order ID", dataIndex: "_id" },
		{ title: "User Name", dataIndex: "name", sorter: (a, b) => a.name.length - b.name.length },
		{ title: "Product", dataIndex: "product" },
		{ title: "Status", dataIndex: "orderStatus" },
		{ title: "Ammount", dataIndex: "ammount", sorter: (a, b) => a.ammount.length - b.ammount.length },
		{ title: "Date", dataIndex: "date" },
		{ title: "Action", dataIndex: "action" },
	];

	return (
		<div className='my-5'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-bold'>Đơn hàng</h2>
				<Button type='primary' onClick={handleExport}>
					Export Orders
				</Button>
			</div>
			<Table columns={columns} dataSource={data} />
		</div>
	);
};

export default Orders;

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { RiListOrdered2 } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { MdLiveHelp } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { BsBoxArrowInRight } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
const { Header, Sider, Content } = Layout;


const AdminLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const navigate = useNavigate();

	const user = useSelector((state) => state.auth.user);

	const handlelogOut = () => {
		localStorage.clear();

		setTimeout(() => {
			window.location.reload();
		}, 1200);
		toast.warning("Logged out Succuessfully!");
	};

	return (
		<Layout /* onContextMenu={(e) => e.preventDefault()} */>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className='logo'>
					<Link to={"/admin"}>
						<h2 className='lg-logo text-white text-3xl font-bold text-center'>
							Sugar Silk Cake Store
						</h2>
					</Link>
					<Link to={"/admin"}>
						<h2 className='sm-logo text-white text-3xl font-bold text-center'>
						Sugar Silk Cake Store
						</h2>
					</Link>
				</div>
				<Menu
					style={{ marginTop: "70px"}}
					theme='dark'
					mode='inline'
					defaultSelectedKeys={[""]}
					onClick={({ key }) => {

						navigate(key);

					}}
					items={[
						{
							key: "",
							icon: <MdDashboard />,
							label: "Thống kê",
						},
						{
							key: "customers",
							icon: <FaUsers />,
							label: "Khách hàng",
						},
						{
							key: "catalog",
							icon: <FaCartPlus />,
							label: "Danh mục",
							children: [
								{
									key: "add-product",
									icon: <FaCartPlus />,
									label: "Thêm bánh",
								},
								{
									key: "products",
									icon: <FaCartPlus />,
									label: "Bánh",
								},

								{
									key: "categories",
									icon: <MdCategory />,
									label: "Loại",
								},

							],
						},
						{
							key: "orders",
							icon: <RiListOrdered2 />,
							label: "Đơn hàng",
						},
						{
							key: "Marketing",
							icon: <BiSolidOffer />,
							label: "Tiếp thị",
							children: [
								{
									key: "coupon",
									icon: <BiSolidOffer />,
									label: "Phiếu giảm giá",
								},
							],
						},

						{
							key: "enquiries",
							icon: <MdLiveHelp />,
							label: "Thắc mắc",
						},
					]}
				/>
			</Sider>
			<Layout>
				<Header
					className='flex justify-between'
					style={{
						padding: 0,
						background: colorBgContainer,
					}}>
					<Button
						type='text'
						icon={
							collapsed ? (
								<BsBoxArrowInRight />
							) : (
								<BsBoxArrowInLeft />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: "22px",
							width: 64,
							height: 64,
						}}
					/>
					<div className='pr-8 flex gap-2 justify-center items-center'>
						<div className='relative mx-3 cursor-pointer'>
							<span className='notification'>2</span>
							<IoNotifications className='text-2xl' />
						</div>
						<div className='w-12 border bg-blue-950 rounded-full p-[4px]'>
							{/* <img
								className='w-[90%]'
								src='./images/drstoreicon.png'
								alt='user profile'
							/> */}
							<Link to={"/admin"}>
								<h2 className='text-3xl text-white font-bold text-center'>
									{user?.name[0]}
								</h2>
							</Link>
						</div>

						<div className='dropdown'>
							<button className='dropbtn py-2'>
								<div className='flex flex-col'>
									<span className='text-lg font-semibold leading-4'>
										{user?.name}
									</span>

									<span className='text-sm font-light'>
										{user?.email}
									</span>
								</div>
							</button>
							<div className='dropdown-content font-semibold'>
								<Link to={"/"} className='drop-items'>
									Profile
								</Link>
								<Link
									onClick={handlelogOut}
									className='drop-items border-t-2'>
									Sign Out
								</Link>
							</div>
						</div>
					</div>
				</Header>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}>
					<ToastContainer
						position='top-right'
						autoClose={250}
						hideProgressBar={false}
						newestOnTop={true}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme='light'
					/>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};
export default AdminLayout;

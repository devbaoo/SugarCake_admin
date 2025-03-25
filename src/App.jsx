import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Enquiries";
import Orders from "./pages/Orders";
import AllProducts from "./pages/AllProducts";
import ProductCategories from "./pages/ProductCategories";
import Customers from "./pages/Customers";
import AddProduct from "./pages/AddProduct";
import Coupon from "./pages/Coupon";
import ViewEnquiry from "./pages/ViewEnquiry";
import ViewOrder from "./pages/ViewOrder";
import AllBlogs from "./pages/AllBlogs";
import AddBlog from "./pages/AddBlog";
import { ProtectedRoutes } from "./routing/ProtectedRoutes";

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route
					path='/admin'
					element={
						<ProtectedRoutes>
							<AdminLayout />
						</ProtectedRoutes>
					}>
					<Route index element={<Dashboard />} />
					<Route path='customers' element={<Customers />} />
					<Route path='products' element={<AllProducts />} />
					<Route path='add-product' element={<AddProduct />} />
					<Route path='blogs' element={<AllBlogs />} />
					<Route path='add-blog' element={< AddBlog/>} />
					<Route path='categories' element={<ProductCategories />} />
					<Route path='coupon' element={<Coupon />} />
					<Route path='orders' element={<Orders />} />
					<Route path='order/:id' element={<ViewOrder />} />
					<Route path='enquiries' element={<Enquiries />} />
					<Route path='enquiries/:id' element={<ViewEnquiry />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./utils/Layout";

import axios from "axios";
axios.defaults.withCredentials = true;
import { ToastContainer } from "react-toastify";
import BlogPage from "./pages/BlogPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import MyBlogsPage from "./pages/MyBlogsPage";
import useAuthCheck from "./hooks/useAuthcheck";
import EditBlogPage from "./pages/EditBlogPage";
import CreateBlogPage from "./pages/CreateBlogPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <BlogPage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "register", element: <RegisterPage /> },
			{ path: "blog/:blog_id", element: <BlogDetailPage /> },
			{ path: "blog/edit/:blog_id", element: <EditBlogPage /> },
			{ path: "create", element: <CreateBlogPage /> },

			{ path: "myblogs", element: <MyBlogsPage /> },
		],
	},
	{ path: "*", element: <NotFoundPage /> },
]);

function App() {
	useAuthCheck();
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	);
}

export default App;

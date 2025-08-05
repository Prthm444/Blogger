// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
	return (
		<>
			<Navbar />
			<main className="px-3 mt-14 ">
				<Outlet />
			</main>
		</>
	);
};

export default Layout;

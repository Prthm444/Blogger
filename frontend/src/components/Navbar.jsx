import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/slices/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.user);
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	const navLinkClass = ({ isActive }) =>
		`px-4 py-2 rounded-md font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-blue-700 hover:text-white"}`;

	const handleLogout = async () => {
		try {
			await axios.post(
				`${SERVER_URL}/user/logout`,
				{},
				{
					withCredentials: true,
				}
			);
			dispatch(clearUser());
			toast.success("Logout successful!");
			setShowLogoutModal(false);
			navigate("/login");
		} catch (err) {
			console.error("Logout failed:", err);
			alert("Logout failed. Please try again.");
		}
	};

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg w-full px-6 py-4 flex justify-between items-center mb-4">
				<h1 className="text-emerald-400 font-bold text-xl select-none">Blogger</h1>
				<div className="flex gap-4 items-center">
					<NavLink to="/create" className={navLinkClass}>
						Post
					</NavLink>
					<NavLink to="/" className={navLinkClass}>
						Blogs
					</NavLink>
					<NavLink to="/myblogs" className={navLinkClass}>
						{user?.username ? user.username : "My"}
						<span></span>'s Blogs
					</NavLink>

					{isLoggedIn ? (
						<button
							onClick={() => setShowLogoutModal(true)}
							className="px-4 py-2 rounded-md font-medium text-red-500 hover:bg-red-700 hover:text-white transition"
						>
							Log out
						</button>
					) : (
						<NavLink to="/login" className={navLinkClass}>
							Login
						</NavLink>
					)}
				</div>
			</nav>

			{/* Logout Confirmation Modal */}
			{showLogoutModal && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
						<div className="flex flex-col space-y-4">
							<h3 className="text-xl font-semibold text-gray-100">Confirm Logout</h3>
							<p className="text-gray-300">Are you sure you want to logout?</p>

							<div className="flex justify-end space-x-3 pt-4">
								<button
									onClick={() => setShowLogoutModal(false)}
									className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition"
								>
									Cancel
								</button>
								<button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Navbar;

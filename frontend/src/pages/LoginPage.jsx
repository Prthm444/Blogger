import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";

import { setUser } from "../redux/slices/userSlice";

export default function LoginPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	const handleChange = (e) => {
		setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		if (!formData.username && !formData.email) {
			setError("Please enter username or email");
			setLoading(false);
			return;
		}

		try {
			const res = await axios.post(`${SERVER_URL}/user/login`, formData, {
				withCredentials: true, // to send cookies
				headers: { "Content-Type": "application/json" },
			});
			setError("");
			dispatch(setUser({ user: res.data.data.user }));
			toast.success("Login successful!");
			navigate("/");
		} catch (err) {
			toast.error(err.status === 404 ? "User not Registered" : err.status === 401 ? "Invalid User Credentials" : "Login failed. Please try again.");
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
			<div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
				{error && <p className="mb-4 text-red-400 font-medium text-center">{error}</p>}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="username" className="block mb-2 font-medium text-gray-300">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Username"
							className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={formData.username}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label htmlFor="email" className="block mb-2 font-medium text-gray-300">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="Email"
							className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label htmlFor="password" className="block mb-2 font-medium text-gray-300">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Password"
							className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
					<p className="text-center text-sm text-gray-600">
						Don’t have an account?{" "}
						<NavLink to="/register" className="text-blue-600 hover:underline hover:text-blue-700 font-medium">
							Sign up here
						</NavLink>
					</p>
				</form>
			</div>
		</div>
	);
}

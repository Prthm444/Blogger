import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
		setError("");
		setSuccessMsg("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMsg("");
		setLoading(true);
		const SERVER_URL = import.meta.env.VITE_SERVER_URL;

		if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
			setError("All fields are required");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(`${SERVER_URL}/user/register`, formData, {
				headers: { "Content-Type": "application/json" },
			});

			setSuccessMsg("User registered successfully!");
			setFormData({ username: "", email: "", password: "" });
			navigate("/login");
			toast.success("Registration Successfull");
		} catch (err) {
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError("Registration failed. Please try again.");
			}
			toast.error(
				err.status === 409 ? "Email or username already exists" : err.status === 400 ? "All fields are required! " : "Registration Failed.."
			);
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
			<div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>
				{error && <p className="mb-4 text-red-400 font-medium text-center">{error}</p>}
				{successMsg && <p className="mb-4 text-green-400 font-medium text-center">{successMsg}</p>}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="username" className="block mb-2 font-medium text-gray-300">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Enter username"
							autoComplete="username"
							className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={formData.username}
							onChange={handleChange}
							required
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
							placeholder="Enter email"
							autoComplete="email"
							className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={formData.email}
							onChange={handleChange}
							required
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
							placeholder="Enter password"
							autoComplete="new-password"
							className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={formData.password}
							onChange={handleChange}
							required
							minLength={6}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	);
}

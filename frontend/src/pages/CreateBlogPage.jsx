import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CreateBlogPage = () => {
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;
	const navigate = useNavigate();

	const [form, setForm] = useState({
		title: "",
		description: "",
		content: "",
		tags: "",
		type: "Other",
	});

	const [saving, setSaving] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic form validation
		if (!form.title.trim() || !form.description.trim() || !form.content.trim()) {
			toast.error("Title, Description, and Content are required.");
			return;
		}

		setSaving(true);

		try {
			await axios.post(
				`${SERVER_URL}/blog/create`,
				{
					title: form.title.trim(),
					description: form.description.trim(),
					content: form.content.trim(),
					tags: form.tags
						.split(",")
						.map((tag) => tag.trim())
						.filter(Boolean),
					type: form.type,
				},
				{ withCredentials: true }
			);

			toast.success("Blog created successfully!");
			navigate("/myblogs"); // redirect to user's blogs page or home
		} catch (err) {
			toast.error(err.status === 409 ? "Blog with same title or description already exits" : "Failed to create blog. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	const user = useSelector((state) => state.user.user);
	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
				<h1 className="text-xl md:text-2xl font-semibold text-center mt-24">User not logged in. Please log in to see your blogs.</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-6 md:px-12 max-w-3xl mx-auto">
			<button onClick={() => navigate(-1)} className="mb-8 text-blue-400 hover:text-blue-600 font-semibold transition" aria-label="Go back">
				← Back
			</button>

			<h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-wide">Create New Blog</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="title" className="block mb-2 font-medium text-gray-300">
						Title <span className="text-red-500">*</span>
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={form.title}
						onChange={handleChange}
						required
						maxLength={150}
						className="w-full px-4 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter blog title"
					/>
				</div>

				<div>
					<label htmlFor="description" className="block mb-2 font-medium text-gray-300">
						Description <span className="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						value={form.description}
						onChange={handleChange}
						required
						maxLength={300}
						className="w-full px-4 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Write a short description"
					/>
				</div>

				<div>
					<label htmlFor="content" className="block mb-2 font-medium text-gray-300">
						Content <span className="text-red-500">*</span>
					</label>
					<textarea
						id="content"
						name="content"
						rows="8"
						value={form.content}
						onChange={handleChange}
						required
						maxLength={2000}
						className="w-full px-4 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Write your blog content here"
					/>
				</div>

				<div>
					<label htmlFor="tags" className="block mb-2 font-medium text-gray-300">
						Tags (comma separated)
					</label>
					<input
						id="tags"
						name="tags"
						type="text"
						value={form.tags}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="e.g. technology, programming"
					/>
				</div>

				<div>
					<label htmlFor="type" className="block mb-2 font-medium text-gray-300">
						Type
					</label>
					<select
						id="type"
						name="type"
						value={form.type}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="Literary">Literary</option>
						<option value="Technical">Technical</option>
						<option value="Other">Other</option>
					</select>
				</div>

				<button
					type="submit"
					disabled={saving}
					className={`w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${
						saving ? "opacity-60 cursor-not-allowed" : ""
					}`}
				>
					{saving ? "Creating..." : "Create Blog"}
				</button>
			</form>
		</div>
	);
};

export default CreateBlogPage;

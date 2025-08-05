import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogPage = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalBlogs, setTotalBlogs] = useState(0);
	const limit = 5; // or whatever default you want
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await axios.get(`${SERVER_URL}/blog/get?page=${page}&limit=${limit}`, { withCredentials: true });
				if (response.data && response.data.data) {
					setBlogs(response.data.data.blogs || []);
					setTotalBlogs(response.data.data.totalBlogs || 0);
					setTotalPages(response.data.data.totalPages || 1);
				} else {
					setBlogs([]);
					setTotalBlogs(0);
					setTotalPages(1);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Unable to fetch blogs. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		fetchBlogs();
	}, [page, SERVER_URL, limit]);

	// Pagination Button Renderer
	const renderPagination = () => {
		if (totalPages <= 1) return null;
		// Only show a few page buttons around the current page for neatness
		const pageNumbers = [];
		let start = Math.max(1, page - 2);
		let end = Math.min(totalPages, page + 2);
		if (page <= 3) end = Math.min(5, totalPages);
		if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);

		for (let i = start; i <= end; i++) {
			pageNumbers.push(i);
		}

		return (
			<div className="flex items-center justify-center gap-2 mt-10">
				<button
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					disabled={page === 1}
					className="px-3 py-1 rounded bg-gray-700 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Previous
				</button>
				{start > 1 && (
					<>
						<button
							onClick={() => setPage(1)}
							className={`px-3 py-1 rounded ${page === 1 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
						>
							1
						</button>
						{start > 2 && <span className="text-gray-400">...</span>}
					</>
				)}
				{pageNumbers.map((num) => (
					<button
						key={num}
						onClick={() => setPage(num)}
						className={`px-3 py-1 rounded ${page === num ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
					>
						{num}
					</button>
				))}
				{end < totalPages && (
					<>
						{end < totalPages - 1 && <span className="text-gray-400">...</span>}
						<button
							onClick={() => setPage(totalPages)}
							className={`px-3 py-1 rounded ${page === totalPages ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
						>
							{totalPages}
						</button>
					</>
				)}
				<button
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					disabled={page === totalPages}
					className="px-3 py-1 rounded bg-gray-700 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
				</button>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10 md:px-12 md:py-16 lg:px-20 lg:py-20 max-w-4xl mx-auto">
			{loading && <p className="text-center text-blue-400 animate-pulse text-lg font-medium tracking-wide">Loading blogs...</p>}
			{error && <p className="text-center text-red-500 font-semibold mb-8 text-lg max-w-xl mx-auto leading-relaxed tracking-wide">{error}</p>}
			{!loading && !error && blogs.length === 0 && <p className="text-center text-gray-400 text-lg font-light tracking-wide">No blogs found.</p>}

			<div className="flex flex-col space-y-6">
				{blogs.map((blog) => (
					<Link key={blog._id} to={`/blog/${blog._id}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
						<article className="bg-gray-800 rounded-lg shadow-md p-6 hover:bg-gray-700 transition">
							<h2 className="text-2xl font-semibold mb-2 tracking-tight text-white">{blog.title}</h2>
							<p className="text-gray-300 mb-4 leading-relaxed text-base line-clamp-3 tracking-wide">{blog.description}</p>
							{blog.tags && blog.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-4">
									{blog.tags.map((tag, idx) => (
										<span
											key={idx}
											className="inline-block bg-blue-700 text-blue-200 rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
										>
											#{tag}
										</span>
									))}
								</div>
							)}
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-400 font-medium tracking-wide">
								<span>
									Type: <span className="text-blue-400">{blog.type || "Other"}</span>
								</span>
								<span className="mt-2 sm:mt-0">
									By: <span className="text-blue-400">{blog.createdBy?.username || "Unknown"}</span>
								</span>
								<span className="mt-2 sm:mt-0 text-right">
									{new Date(blog.createdAt).toLocaleDateString(undefined, {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</span>
							</div>
						</article>
					</Link>
				))}
			</div>

			{/* Pagination Controls */}
			{renderPagination()}
			{/* Total count info, optional */}
			{totalBlogs ? (
				<p className="text-center text-gray-400 mt-4 text-sm">
					Showing page {page} of {totalPages} &middot; {totalBlogs} blogs total
				</p>
			) : null}
		</div>
	);
};

export default BlogPage;

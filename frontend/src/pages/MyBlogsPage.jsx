import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const MyBlogsPage = () => {
	const [myBlogs, setMyBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteModal, setDeleteModal] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState(null);

	// Pagination state
	const [page, setPage] = useState(1);
	const [totalBlogs, setTotalBlogs] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 5; // blogs per page, adjust as you like

	const navigate = useNavigate();
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;
	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		const fetchMyBlogs = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await axios.get(`${SERVER_URL}/blog/getmyblogs?page=${page}&limit=${limit}`, { withCredentials: true });
				if (response.data && response.data.data) {
					setMyBlogs(response.data.data.blogs || []);
					setTotalBlogs(response.data.data.totalBlogs || 0);
					setTotalPages(response.data.data.totalPages || 1);
				} else {
					setMyBlogs([]);
					setTotalBlogs(0);
					setTotalPages(1);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Unable to fetch your blogs. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchMyBlogs();
	}, [SERVER_URL, page, limit]);

	const handleEditClick = (blogId) => {
		navigate(`/blog/edit/${blogId}`);
	};

	const handleDeleteClick = (blog) => {
		setSelectedBlog(blog);
		setDeleteModal(true);
	};

	const handleDeleteBlog = async () => {
		if (!selectedBlog) return;
		try {
			await axios.post(`${SERVER_URL}/blog/delete`, { blog_id: selectedBlog._id }, { withCredentials: true });
			toast.success("Blog deleted successfully!");
			// Refetch current page if needed, or optimistically remove
			setMyBlogs((prev) => prev.filter((b) => b._id !== selectedBlog._id));
			setTotalBlogs((prev) => prev - 1);
			// If last blog on last page is deleted, move to previous page
			if (myBlogs.length === 1 && page > 1) {
				setPage(page - 1);
			}
		} catch (err) {
			toast.error(
				err.response?.status === 404
					? "Blog Not found!"
					: err.response?.status === 403
					? "You are not authorized for this action!"
					: "Failed to delete blog. Please try again."
			);
		} finally {
			setDeleteModal(false);
			setSelectedBlog(null);
		}
	};

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
				<h1 className="text-xl md:text-2xl font-semibold text-center mt-24">User not logged in. Please log in to see your blogs.</h1>
			</div>
		);
	}

	if (!loading && myBlogs.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
				<h1 className="text-xl md:text-2xl font-semibold text-center mt-24">You don't have any blogs yet. Create one now!</h1>
			</div>
		);
	}

	const renderPagination = () => {
		if (totalPages <= 1) return null;
		// Show a window of max 5 page numbers
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
		<div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-6 md:px-12 max-w-4xl mx-auto">
			<h1 className="text-4xl font-extrabold mb-12 text-center tracking-wide">My Blogs</h1>

			{loading && <p className="text-center text-blue-400 animate-pulse text-lg font-medium tracking-wide">Loading your blogs...</p>}

			{error && <p className="text-center text-red-500 font-semibold mb-8 max-w-xl mx-auto leading-relaxed tracking-wide">{error}</p>}

			{!loading && !error && myBlogs.length > 0 && (
				<>
					<div className="flex flex-col divide-y divide-gray-700">
						{myBlogs.map((blog) => (
							<article key={blog._id} className="py-6 flex flex-col md:flex-row md:justify-between md:items-center">
								<div className="md:flex-1">
									<h2 className="text-2xl font-semibold leading-snug tracking-tight text-white mb-2">{blog.title}</h2>
									<p className="text-gray-300 leading-relaxed mb-3 line-clamp-3 tracking-wide">{blog.description}</p>
									<div className="flex flex-wrap gap-2">
										{blog.tags?.map((tag, idx) => (
											<span
												key={idx}
												className="inline-block bg-blue-700 text-blue-200 rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
											>
												#{tag}
											</span>
										))}
									</div>
								</div>
								<div className="mt-4 md:mt-0 md:flex md:flex-col md:items-end text-gray-400 font-medium tracking-wide space-y-2">
									<span>Type: {blog.type || "Other"}</span>
									<span className="text-gray-300">
										{new Date(blog.createdAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</span>
									<div className="flex space-x-2">
										<button
											onClick={() => handleEditClick(blog._id)}
											className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition"
											aria-label={`Edit blog: ${blog.title}`}
										>
											Edit
										</button>
										<button
											onClick={() => handleDeleteClick(blog)}
											className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm transition"
											aria-label={`Delete blog: ${blog.title}`}
										>
											Delete
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
					{renderPagination()}
					<p className="text-center text-gray-400 mt-4 text-sm">
						Showing page {page} of {totalPages} &middot; {totalBlogs} blogs total
					</p>
				</>
			)}

			{/* Delete Confirmation Modal */}
			{deleteModal && (
				<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
					<div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
						<div className="flex flex-col space-y-4">
							<h3 className="text-xl font-semibold text-gray-100">Confirm Delete</h3>
							<p className="text-gray-300">
								Are you sure you want to delete the blog <span className="text-red-400 font-bold">{selectedBlog?.title}</span>?
							</p>
							<div className="flex justify-end space-x-3 pt-4">
								<button
									onClick={() => {
										setDeleteModal(false);
										setSelectedBlog(null);
									}}
									className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition"
								>
									Cancel
								</button>
								<button onClick={handleDeleteBlog} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyBlogsPage;

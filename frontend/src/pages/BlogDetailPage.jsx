import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BlogDetailPage = () => {
	const { blog_id } = useParams(); // get blog id from route param
	const navigate = useNavigate();
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await axios.get(`${SERVER_URL}/blog/getblog/${blog_id}`, {
					withCredentials: true,
				});
				setBlog(response.data.data);
			} catch (err) {
				setError(err.response?.data?.message || "Unable to fetch blog. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchBlog();
	}, [blog_id, SERVER_URL]);
    
    const user = useSelector((state) => state.user.user);
	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
				<h1 className="text-xl md:text-2xl font-semibold text-center mt-24">User not logged in. Please log in to see your blogs.</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
			{loading && <p className="text-center text-blue-400 animate-pulse text-base font-medium tracking-wide">Loading blog...</p>}

			{error && <p className="text-center text-red-500 font-semibold mb-8 text-base max-w-xl mx-auto leading-relaxed tracking-wide">{error}</p>}

			{!loading && blog && (
				<article>
					<h1 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-wide leading-snug">{blog.title}</h1>

					{/* Tags */}
					<div className="flex flex-wrap gap-3 mb-8">
						{blog.tags &&
							blog.tags.length > 0 &&
							blog.tags.map((tag, idx) => (
								<span
									key={idx}
									className="inline-block bg-blue-700 bg-opacity-60 text-blue-200 rounded-full px-4 py-1 text-sm font-semibold tracking-wide select-none"
								>
									#{tag}
								</span>
							))}
					</div>

					{/* Meta info */}
					<div className="text-sm text-gray-400 mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-center font-medium tracking-wide leading-tight">
						<span>
							Type: <span className="text-blue-400">{blog.type || "Other"}</span>
						</span>
						<span>
							By: <span className="text-blue-400">{blog.createdBy?.username || "Unknown"}</span>
						</span>
						<span className="mt-2 sm:mt-0">
							Published:{" "}
							<time dateTime={blog.createdAt}>
								{new Date(blog.createdAt).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</time>
						</span>
					</div>

					{/* Content */}
					<p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap tracking-wide">{blog.content}</p>
				</article>
			)}
		</div>
	);
};

export default BlogDetailPage;

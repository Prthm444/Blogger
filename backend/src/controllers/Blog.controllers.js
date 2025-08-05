import { asyncHandler } from "../utils/Async.utils.js";
import { ApiError } from "../utils/Error.utils.js";
import Blog from "../models/Blog.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const addBlog = asyncHandler(async (req, res) => {
	const { title, description, content, tags, type } = req.body;

	if ([title, description, content].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	const existedBlog = await Blog.findOne({
		$or: [{ description }, { title }],
	});

	if (existedBlog) {
		throw new ApiError(409, "Similar blog already exists");
	}

	const newBlog = await Blog.create({
		title,
		description,
		content,
		tags,
		type,
		createdBy: req.user,
	});
	if (!newBlog) {
		throw new ApiError(500, "Something went wrong while creating blog");
	}
	return res.status(201).json(new ApiResponse(200, newBlog, "Blog Created successfully!!"));
});

const deleteBlog = asyncHandler(async (req, res) => {
	const { blog_id } = req.body;

	if (!blog_id) {
		throw new ApiError(400, "Blog ID is required");
	}

	const blog = await Blog.findById(blog_id);

	if (!blog) {
		throw new ApiError(404, "Blog not found");
	}

	if (blog.createdBy.toString() !== req.user._id.toString()) {
		throw new ApiError(403, "You are not authorized to delete this blog");
	}

	await blog.deleteOne();

	return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});
const getAllBlogs = asyncHandler(async (req, res) => {
	let { page = 1, limit = 3 } = req.query;
	page = parseInt(page);
	limit = parseInt(limit);

	const totalBlogs = await Blog.countDocuments();

	const blogs = await Blog.find()
		.populate("createdBy", "username email")
		.select("-content")
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				blogs,
				totalBlogs,
				currentPage: page,
				totalPages: Math.ceil(totalBlogs / limit),
			},
			"Fetched all blogs successfully"
		)
	);
});

const getBlog = asyncHandler(async (req, res) => {
	const blog_id = req.params.blog_id;

	const blog = await Blog.findById(blog_id).populate("createdBy", "username email");

	if (!blog) {
		throw new ApiError(404, "No blog found");
	}

	return res.status(200).json(new ApiResponse(200, blog, "Fetched blog successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {
	const { blog_id, title, description, content, tags, type } = req.body;

	if (!blog_id) {
		throw new ApiError(400, "Blog ID is required");
	}

	const blog = await Blog.findById(blog_id);

	if (!blog) {
		throw new ApiError(404, "Blog not found");
	}

	if (blog.createdBy.toString() !== req.user._id.toString()) {
		throw new ApiError(403, "You are not authorized to update this blog");
	}

	if (title?.trim()) blog.title = title.trim();
	if (description?.trim()) blog.description = description.trim();
	if (content?.trim()) blog.content = content.trim();
	if (Array.isArray(tags)) blog.tags = tags;
	if (type) blog.type = type;

	await blog.save();

	return res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});

const getMyBlogs = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	let { page = 1, limit = 5 } = req.query; // default limit 5, change as you like
	page = parseInt(page);
	limit = parseInt(limit);

	const totalBlogs = await Blog.countDocuments({ createdBy: userId });

	const blogs = await Blog.find({ createdBy: userId })
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				blogs,
				totalBlogs,
				currentPage: page,
				totalPages: Math.ceil(totalBlogs / limit),
			},
			"Fetched your blogs successfully"
		)
	);
});

export { addBlog, deleteBlog, getAllBlogs, updateBlog, getMyBlogs, getBlog };

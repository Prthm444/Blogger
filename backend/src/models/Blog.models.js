import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [150, "Title must be less than 150 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			maxlength: [300, "Description must be less than 300 characters"],
		},
		type: {
			type: String,
			enum: {
				values: ["Literary", "Technical", "Other"],
				message: "Type must be either Literary, Technical, or Other",
			},
			default: "Other",
		},
		tags: {
			type: [String],
			default: [],
			validate: {
				validator: function (val) {
					return val.every((tag) => typeof tag === "string" && tag.length <= 30);
				},
				message: "Each tag must be a string with max 30 characters",
			},
		},
		content: {
			type: String,
			required: [true, "Content is required"],
			maxlength: [20000, "Content must be less than 2000 characters"],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt
	}
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

import { asyncHandler } from "../utils/Async.utils.js";
import { ApiError } from "../utils/Error.utils.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
	//console.log("called jwt , cookies in req : ", req.cookies);
	try {
		const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			console.log("no token found");
			throw new ApiError(404, "Unauthorized request  ");
		}

		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		const user = await User.findById(decodedToken._id).select("-password -RefreshToken");

		if (!user) {
			throw new ApiError(404, "Invalid Access Token");
		}

		req.user = user;
		next();
	} catch (error) {
		throw new ApiError(404, error?.message || "Invalid Access Token");
	}
});

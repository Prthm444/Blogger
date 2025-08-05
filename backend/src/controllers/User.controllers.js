import { asyncHandler } from "../utils/Async.utils.js";
import { ApiError } from "../utils/Error.utils.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const checkLogin = asyncHandler(async (req, res) => {
	if (!req.user) {
		throw new ApiError(404, "Current user info not found");
	}
	res.status(200).json(new ApiResponse(200, req.user, "user checked"));
});

const generateAccessAndRefreshTokens = async (userId) => {
	try {
		const user = await User.findById(userId);
		const AccessToken = user.generateAccessToken();
		const RefreshToken = user.generateRefreshToken();

		user.RefreshToken = RefreshToken;
		//console.log(user);
		await user.save({ validateBeforeSave: false });
		//console.log("ACC: ", AccessToken);
		return { AccessToken, RefreshToken };
	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating refresh and access token");
	}
};

const registerUser = asyncHandler(async (req, res) => {
	//console.log(req.body);

	const { username, email, password } = req.body;
	if ([username, email, password].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existedUser) {
		throw new ApiError(409, "Username or email already exists");
	}

	const user = await User.create({
		username: username.toLowerCase(),
		email,
		password,
	});

	const createdUser = await User.findById(user._id).select("-password -RefreshToken");
	if (!createdUser) {
		throw new ApiError(500, "Something went wrong during registering user");
	}
	return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully!!"));
});

const loginUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	//console.log(username);

	if (!username && !email) {
		throw new ApiError(400, "username or email is required");
	}

	const user = await User.findOne({
		$or: [{ username: username.toLowerCase() }, { email }],
	});
	//console.log(user);
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

	const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(user._id);

	const loggedInUser = await User.findById(user._id).select("-password -Refreshtoken");

	const options = {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		path: "/",
	};

	//console.log(AccessToken);

	return res
		.status(200)
		.cookie("accessToken", AccessToken, options)
		.cookie("refreshToken", RefreshToken, options)
		.json(new ApiResponse(200, { user: loggedInUser }, "User LoggedIn Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1,
			},
		},
		{
			new: true,
		}
	);

	const options = {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		path: "/",
	};

	return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out"));
});

export { checkLogin, registerUser, loginUser, logoutUser };

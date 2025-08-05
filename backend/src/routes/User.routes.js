import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/User.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middlewares.js";

import { ApiResponse } from "../utils/ApiResponse.utils.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verifyUser").get(verifyJWT, (req, res) => {
	res.status(200).send(new ApiResponse(200, req.user, "JWT middleware verified"));
});

router.route("/logout").post(verifyJWT, logoutUser);

export default router;

import { Router } from "express";
import { addBlog, deleteBlog, getAllBlogs, getBlog, getMyBlogs, updateBlog } from "../controllers/Blog.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middlewares.js";

import { ApiResponse } from "../utils/ApiResponse.utils.js";

const router = Router();

router.route("/create").post(verifyJWT, addBlog);
router.route("/delete").post(verifyJWT, deleteBlog);
router.route("/get").get(getAllBlogs);
router.route("/update").post(verifyJWT, updateBlog);
router.route("/getmyblogs").get(verifyJWT, getMyBlogs);
router.route("/getblog/:blog_id").get(verifyJWT, getBlog);
export default router;

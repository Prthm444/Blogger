import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/User.routes.js";
import BlogRouter from "./routes/Blog.routes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
console.log(process.env.CORS_ORIGIN);
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/blogger/test", (req, res) => {
	res.status(200).send("hii from server, I am alive btw");
});

app.use("/user", UserRouter);
app.use("/blog", BlogRouter);

export { app };

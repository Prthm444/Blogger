import dotenv from "dotenv";
import { app } from "./src/app.js";
import connectDB from "./src/db/Index.js";

dotenv.config();

connectDB();
app.listen(process.env.PORT, () => {
	console.log("Server is listening....");
});

import express from "express";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import * as dotenv from "dotenv"
import Connection from "./db/Connection.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MONGO_URL = process.env.MONGO_URL; 
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req,res) => {
    res.send({message: "Hello World"})
})
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, async() => {
    console.log(`localhost:${PORT}`)
    await Connection(MONGO_URL);
})
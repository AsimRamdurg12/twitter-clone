import path from "path";
import express from "express";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import * as dotenv from "dotenv"
import cors from "cors";
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
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const app = express();
app.use(express.json({limit: "10mb"}));
app.use(cookieParser());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, async() => {
    console.log(`localhost:${PORT}`)
    await Connection(MONGO_URL);
})
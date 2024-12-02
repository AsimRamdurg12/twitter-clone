import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";


export const protectRoute = async(req, res, next) => {
try {
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            error: "Please Login first"
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
        return res.status(402).json({
            error: "Unauthorized"
        })
    }
    const user = await UserModel.findById(decoded.userId).select("-password");

    if(!user) {
        return res.status(404).json({
            error: "User not found"
        })
    }
    req.user = user;
    next();
} catch (error) {
    console.log(`Error in protectRoute: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
}
}
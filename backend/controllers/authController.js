import { json } from "express";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const signup = async(req, res) => {
    try {
        const {fullname,username, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
           return res.status(400).json({ error: "Invalid email format"});
        }

        const existingUser = await UserModel.findOne({username})
        if(existingUser){
            return res.status(400).json({ error: "username already taken"})
        }

        const existingEmail = await UserModel.findOne({email})
        if(existingEmail){
           return res.status(400).json({error: "email already taken"})
        }

        if(password.length < 8){
            res.status(400).json({error: "password is less than 8 characters"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            fullname, 
            username,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.json({
                _id:newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                followers: newUser.followers,
                following: newUser.following,
                coverImg: newUser.coverImg,
                profileImg: newUser.profileImg,
                bio: newUser.bio,
                link: newUser.link
            })

        }else{
            res.status(400).json({
                error: "Invalid user data"
            })
        }
    } catch (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
    }


}
export const login = async(req, res) => {
    
    const {username,email, password} = req.body;
      try {  
// const user = await UserModel.findOne({ username});

    const user = await UserModel.findOne({
        $or: [
            {username: {$eq: username}},
            {email: {$eq: email}}
        ]
    })
    const isPasswordCorrect = bcrypt.compare(password, user.password);
    
    if(!user || !isPasswordCorrect){
        res.status(400).json({error: "Invalid Credentials"})
    }

  generateTokenAndSetCookie(user._id, res)


    res.status(200).json({
             _id:user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            password: user.password,
            followers: user.followers,
            following: user.following,
            coverImg: user.coverImg,
            profileImg: user.profileImg,
            bio: user.bio,
            link: user.link
        })

    } catch (error) {
        console.log(`error in Login: ${error.message}`);
        res.status(500).json({error: "Internal server error"})     
        
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log(`Error while Logout: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
    }
};


export const getMe = async(req, res) => {
try {
    const user = await UserModel.findById(req.user._id).select("-password");
    res.status(200).json(user)
} catch (error) {
    console.log(`Error in getMe: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
}
}
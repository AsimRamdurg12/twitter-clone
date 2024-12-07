import {v2 as cloudinary} from "cloudinary";
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";
import { NotificationModel } from "../models/notificationModel.js";



export const getAllPosts = async(req, res) => {
    try {
        const posts = await PostModel.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comment.user",
            select: "-password"
        });

        if(posts?.length === 0) return res.status(200).json([])

            res.status(200).json(posts);

    } catch (error) {
        console.log(`error in getAllPost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
    }
}


export const getUserPosts = async(req, res) => {
   try {
    
    const { username } = req.params;

    const user = await UserModel.findOne({username});

    if(!user) return res.status(400).json({error: "User not found"});


    const posts = await PostModel.find({user: user._id}).sort({createdAt: -1}).populate({
        path: "user",
        select: "-password"
    }).populate({
        path: "comment.user",
        select: "-password"
    })

    res.status(200).json(posts);
    } catch (error) {
    console.log(`error in getUserPost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
   }
}

export const createPost = async( req, res) => {
    try{
    const {text}  = req.body;
    let {img} = req.body;
    const userId = req.user._id.toString();

    const user = await UserModel.findById(userId);
    if(!user) return res.status(400).json({error: "user not found"})

        if(!text && !img) return res.status(400).json({error: "Post must have an image or text"})

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url; 
        }

        const newPost = await PostModel.create({
            user: userId, text, img
        })

        await newPost.save();


        res.status(201).json({message: "Post Created", post: newPost})
    }catch(error){
        console.log(`error in createPost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
    }
}


export const likePost = async(req, res) => {
 try {
    const userId = req.user._id;
    const {id: postId} = req.params;

    const post = await PostModel.findById(postId);

    if(!post) return res.status(400).json({ error: "Post not found"});

    const userLikePost = post.likes.includes(userId);

    if(userLikePost){
        await PostModel.updateOne({_id: postId}, {$pull: {likes: userId}});
        await UserModel.updateOne({_id: userId}, {$pull: {likedPosts: postId}})

        const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())
        res.status(200).json(updatedLikes);

    }else{
        post.likes.push(userId);
                await UserModel.updateOne({_id: userId}, {$push: {likedPosts: postId}})

        await post.save();

        const notification = await NotificationModel.create({
            from: userId,
            to: post.user,
            type: "like",
        })

        await notification.save();

        const updatedLikes = post.likes;
        res.status(201).json(updatedLikes)
    }
 } catch (error) {
    console.log(`error in likedPost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
 }

}


export const commentOnPost = async( req, res) => {
    try{
const {text} = req.body;
let {img} = req.body;
const postId = req.params.id;
const userId = req.user._id;

if(!text) return res.status(400).json({ error: "Text field is required"});

const post = await PostModel.findById(postId);

if(!post) return res.status(400).json({ error: "Post not found"});

const comment = {user: userId, text, img}

post.comment.push(comment);
await post.save();

res.status(200).json(post);
    }catch(error){
        console.log(`error in commentOnPost: ${error.message}`)
        res.status(400).json({ error: "Internal server error"})
    }
}






export const deletePost = async( req, res) => {
try {
    const {id} = req.params;

    const post = await PostModel.findById(id);

    if(!post) return res.status(400).json({error: "Post not found"});

    if(post.user.toString() !== req.user._id.toString()) return res.status(400).json({error: "You unauthorized to delete post"})
    
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await PostModel.findByIdAndDelete(id)
        res.status(200).json({ message: "Post deleted successfully"})

} catch (error) {
    console.log(`error in deletePost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
}
}

export const getLikedPosts = async(req, res) => {
try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if(!user) return res.status(400).json({error: "User not found"});

    const likedPosts = await PostModel.find({_id: {$in: user.likedPosts}}).populate({
        path: "user",
        select: "-password",
    }).populate({
        path: "comment.user",
        select: "-password"
    })

res.status(200).json(likedPosts)
} catch (error) {
     console.log(`error in getLikedPost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
}
}


export const getFollowingPosts = async(req, res) => {
        
    try {
         const userId = req.user._id;
        const user = await UserModel.findById(userId);

        if(!user) return res.status(400).json({error: "User not found"})

        const following = user.following;

        const feedPosts = await PostModel.find({user: {$in: following}}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comment.user",
            select: "-password"
        })

        res.status(200).json(feedPosts);
        } catch (error) {
        console.log(`error in getFollowingPost: ${error.message}`);
        res.status(500).json({error: "Internal server error"})
    }
}

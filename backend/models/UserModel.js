import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required:true,
        unique:true,
    },
   fullname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default:""
    },
    bio: {
        type: String,
        default:"",
    },
    link: {
        type: String,
        default:""
    },
    likedPosts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default:[]
    }]
}, {
    timestamps: true
})

export const UserModel = model("User", UserSchema)
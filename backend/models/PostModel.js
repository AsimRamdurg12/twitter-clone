import mongoose, { model, Schema } from "mongoose";


const PostSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String
    },
    img: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comment: [
        {
       text: {
         type: String,
        required: true
       },
       user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
       },
       img: {
        type: String,
       }
    }
]
}, {timestamps: true})


export const PostModel = model("Post", PostSchema);
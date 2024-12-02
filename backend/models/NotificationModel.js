import mongoose, { model, Schema } from "mongoose";



const NotificationSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    type: {
        type: String,
        required:true,
        enum: ["follow", "like"]
    },
    read: {
        type: Boolean,
        default:false,
    }
},
    {
        timestamps: true,
    }
)

export const NotificationModel = model("Notification", NotificationSchema);
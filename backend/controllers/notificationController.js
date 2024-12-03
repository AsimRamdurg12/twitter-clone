import { NotificationModel } from "../models/notificationModel.js"






export const getNotifications = async(req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await NotificationModel.find({to: userId}).populate({
            path: "from",
            select: "username profileImg"
        })

        await NotificationModel.updateMany({to:userId}, {read: true})

        res.status(200).json(notifications);


    } catch (error) {
        console.log(`Error in getNotifications: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
    }
}
export const deleteNotifications = async(req, res) => {
    try {
        const userId = req.user._id;

        await NotificationModel.deleteMany({to: userId});

        res.status(200).json({message: "Notifications deleted successfully"})
    } catch (error) {
        console.log(`Error in deleteNotifications: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
    }

}

export const deleteNotification = async(req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await NotificationModel.findById(notificationId)

        if(!notification) return res.status(400).json({error: "Notification not Found"});

        if(notification.to.toString() !== userId.toString()) return res.status(403).json({ error: "You are not allowed to delete this notification"});


            await NotificationModel.deleteOne(notificationId);
            res.status(201).json({ message: "Notification deleted successfully"})
        

    } catch (error) {
        console.log(`Error in deleteNotifications: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
    }
}
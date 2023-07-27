const notificationModel = require("../Models/notificationModel");

const createNotification = async (req, res) => {
  try {
    const { userId, senderId, isRead } = req.body; // Assuming you pass these fields in the request body
    const notification = new notificationModel({ userId, senderId, isRead });
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId as a parameter in the URL
    const notifications = await notificationModel.find({ userId });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({ error: "Failed to fetch user notifications" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params; // Assuming you pass the notificationId as a parameter in the URL
    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    const modifiedNotification = notification.save();
    res.json(modifiedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params; // Assuming you pass the notificationId as a parameter in the URL
    await notificationModel.findByIdAndDelete(notificationId);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

const deleteUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId as a parameter in the URL
    await notificationModel.deleteMany({ userId });
    res.json({ message: "User notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting user notifications:", error);
    res.status(500).json({ error: "Failed to delete user notifications" });
  }
};

const markUserAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId as a parameter in the URL
    const response = await notificationModel.updateMany(
      { userId },
      { isRead: true }
    );

    res.json({
      message: "All user notifications marked as read",
      data: response,
    });
  } catch (error) {
    console.error("Error marking all user notifications as read:", error);
    res
      .status(500)
      .json({ error: "Failed to mark all user notifications as read" });
  }
};
const markSenderAllNotificationsAsRead = async (req, res) => {
  try {
    const { senderId } = req.params; // Assuming you pass the userId as a parameter in the URL
    const response = await notificationModel.updateMany(
      { senderId },
      { isRead: true }
    );

    res.json({
      message: "All sender notifications marked as read",
      data: response,
    });
  } catch (error) {
    console.error("Error marking all sender notifications as read:", error);
    res
      .status(500)
      .json({ error: "Failed to mark all sender notifications as read" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteUserNotifications,
  markUserAllNotificationsAsRead,
  markSenderAllNotificationsAsRead,
};

const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteUserNotifications,
  markUserAllNotificationsAsRead,
} = require("../Controllers/notificationController");

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.put("/:notificationId", markNotificationAsRead);
router.delete("/:notificationId", deleteNotification);
router.delete("/:userId", deleteUserNotifications);
router.put("/mark-read/:userId", markUserAllNotificationsAsRead);
router.put("/sender-notifications/:senderId", markUserAllNotificationsAsRead);

module.exports = router;

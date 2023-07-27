const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: String,
    senderId: String,
    isRead: Boolean,
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notifications", notificationSchema);

module.exports = notificationModel;

const express = require("express");
const {
  createMessage,
  getMessages,
  deleteMessage,
  deleteAllMessages,
} = require("../Controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);
router.delete("/delete/:messageId", deleteMessage);
router.delete("/delete/:senderId", deleteAllMessages);

module.exports = router;

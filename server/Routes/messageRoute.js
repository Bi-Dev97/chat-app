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
router.delete("/delete/many/:chatId", deleteAllMessages);

module.exports = router;

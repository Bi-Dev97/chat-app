const express = require("express");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../Controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);
router.delete("/delete/:messageId", deleteMessage);

module.exports = router;

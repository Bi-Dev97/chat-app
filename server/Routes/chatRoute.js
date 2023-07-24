const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
  deleteUserChat,
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);
router.delete("/delete/:userId", deleteUserChat);

module.exports = router;

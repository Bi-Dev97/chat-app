const messageModel = require("../Models/messageModel");

//Create message
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get messages
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await messageModel.findByIdAndDelete(messageId);
    res.status(200).json("Message deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Delete all messages
const deleteAllMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Delete all messages with the given senderId
    const result = await messageModel.deleteMany({ chatId });

    // Check if any messages were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No messages found for the provided senderId." });
    }

    return res.json({ message: "All messages for the provided senderId have been deleted." });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while deleting messages." });
  }
};

module.exports = { createMessage, getMessages, deleteMessage, deleteAllMessages };

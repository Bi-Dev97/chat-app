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

module.exports = { createMessage, getMessages, deleteMessage };

const chatModel = require("../Models/chatModel");

// Create Chat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    /**The $all operator is used to perform queries where a 
    field matches an array that contains all the specified 
    elements. It checks if all the specified values are 
    present in the array field. */
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    }); // Here we find the chat doc where members match both req.body' ids so we use mongoose $all's operator

    //If the chat already exist we just return it immediately
    if (chat) return res.status(200).json(chat);

    // If the chat not exist we create it
    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Find User Chats
const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    /**Here we get chats for a specific user so we use $in
         operator to filter and find all chats where their 
         members array within an id match the specific user's id
         The $in operator is used to perform queries where a field
          matches any of the specified values in an array. 
          It checks if the field value matches any of the specified values.*/
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//Find Chat
const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//Delete User's chat

const deleteUserChat = async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedChat = await chatModel.findOneAndDelete({
      members: { $in: [userId] },
    });

    res.status(200).json("Chat deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, findChat, findUserChats, deleteUserChat };

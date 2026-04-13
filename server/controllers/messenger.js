const Chat = require("../models/chat");
const User = require("../models/user");
const mongoose = require("mongoose");

//
exports.getMessage = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    const chatRoom = await Chat.findOne({ roomId }).populate(
      "userId",
      "fullname email",
    );

    if (!chatRoom) {
      return res.status(404).json({
        message: "Chatroom Not Found!",
      });
    }

    return res.status(200).json({
      data: chatRoom.messages,
      room: chatRoom.roomId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.postMessage = async (req, res, next) => {
  const { roomId, message, is_admin } = req.query;

  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { roomId: roomId },
      {
        $push: {
          messages: {
            message: message,
            is_admin: is_admin,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    );

    if (!updatedChat) {
      return res.status(404).json({
        message: "Chatroom Not Found!",
      });
    }

    return res.status(201).json({
      message: "Send message successfully!",
      lastMessage: updatedChat.messages[updatedChat.messages.length - 1],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.postConversation = async (req, res, next) => {
  const email = req.query.email;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(202).json({
        success: false,
        message: "User is being processed, please wait.",
      });
    }

    const existingChat = await Chat.findOne({ userId: user._id });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        roomId: existingChat.roomId,
        message: "Conversation already exists.",
      });
    }

    const newRoomId = new mongoose.Types.ObjectId();
    const newChat = new Chat({
      roomId: newRoomId,
      userId: user._id,
      messages: [],
    });

    await newChat.save();

    return res.status(201).json({
      success: true,
      roomId: newRoomId,
      message: "Create new messenger successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const Chat = require("../models/chat");
const mongoose = require("mongoose");

//
exports.getMessageByRoomId = async (req, res, next) => {
  const roomId = req.query.roomId;

  if (!roomId) {
    return res.status(400).json({ message: "" });
  }

  try {
    const chatRoom = await Chat.findOne({ roomId: roomId }).populate(
      "userId",
      "fullname email",
    );

    if (!chatRoom) {
      return res.status(404).json({ message: "Chatroom Not Found!" });
    }

    return res.status(200).json(chatRoom);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNewRoom = async (req, res, next) => {
  try {
    const newRoomId = new mongoose.Types.ObjectId();

    const newChat = new Chat({
      roomId: newRoomId,
      messages: [],
      userId: req.session && req.session.user ? req.session.user._id : null,
    });

    const result = await newChat.save();

    return res.status(201).json({
      message: "Create new chatroom successfully!",
      roomId: result.roomId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addMessage = async (req, res, next) => {
  const { roomId, message, is_admin } = req.body;

  try {
    const chatRoom = await Chat.findOne({ roomId: roomId });

    if (!chatRoom) {
      return res.status(404).json({ message: "Chatroom Not Found!" });
    }

    const newMessage = {
      message: message,
      is_admin: is_admin || false,
      createdAt: new Date(),
    };

    chatRoom.messages.push(newMessage);

    const updatedChat = await chatRoom.save();

    return res.status(200).json({
      message: "Adding message successfully!",
      data: updatedChat,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllRoom = async (req, res, next) => {
  try {
    const allRooms = await Chat.find()
      .populate("userId", "fullname email")
      .sort({ updatedAt: -1 });

    return res.status(200).json(allRooms);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

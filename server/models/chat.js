const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const chatSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    messages: [
      {
        message: {
          type: String,
          required: true,
        },
        is_admin: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

//
module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

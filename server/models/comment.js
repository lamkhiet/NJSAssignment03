const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const commentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comment", commentSchema);

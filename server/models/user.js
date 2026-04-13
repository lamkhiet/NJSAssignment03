const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: Number,
      required: true,
      default: 0,
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          count: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true },
);

//

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

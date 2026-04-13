const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryInfo: {
      fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    total: {
      type: Number,
      required: true,
    },
    delivery: {
      type: String,
      default: "Waiting for progressing",
    },
    status: {
      type: String,
      default: "Waiting for pay",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

//
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);

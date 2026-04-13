const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: [String],
      validate: [(val) => val.length <= 5],
    },

    short_desc: {
      type: String,
      required: true,
    },
    long_desc: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

//
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;

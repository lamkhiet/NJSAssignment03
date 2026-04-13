const User = require("../models/User");
const Product = require("../models/Product");

//
exports.getCart = async (req, res, next) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId).populate("cart.items.productId");

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.status(200).json(user.cart.items);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  const { productId, userId } = req.query;
  const count = parseInt(req.query.count);

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    if (product.count < count) {
      return res.status(400).json({ message: "Số lượng trong kho không đủ" });
    }

    const user = await User.findById(userId);
    const cartItemIndex = user.cart.items.findIndex((cp) => {
      return cp.productId.toString() === productId.toString();
    });

    let newQuantity = count;
    const updatedCartItems = [...user.cart.items];

    if (cartItemIndex >= 0) {
      newQuantity = user.cart.items[cartItemIndex].count + count;
      updatedCartItems[cartItemIndex].count = newQuantity;
    } else {
      updatedCartItems.push({ productId: productId, count: newQuantity });
    }

    user.cart.items = updatedCartItems;
    await user.save();

    res.status(201).json({ message: "Adding Product Successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  const { productId, count, userId } = req.query;

  try {
    const user = await User.findById(userId);
    const cartItemIndex = user.cart.items.findIndex(
      (cp) => cp.productId.toString() === productId,
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Product not in Cart" });
    }

    user.cart.items[cartItemIndex].count = count;
    await user.save();

    res.status(200).json({ message: "Update Cart Sucessfully!" });
  } catch (err) {
    next(err);
  }
};

exports.deleteFromCart = async (req, res, next) => {
  const { productId, userId } = req.query;

  try {
    const user = await User.findById(userId);

    user.cart.items = user.cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await user.save();
    res.status(200).json({ message: "Delete Product Successfully!" });
  } catch (err) {
    next(err);
  }
};

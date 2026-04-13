const Order = require("../models/Order");
const Product = require("../models/Product");

//
exports.getHistory = async (req, res, next) => {
  const userId = req.query.userId;

  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getDetailHistory = async (req, res, next) => {
  const historyId = req.params.historyId;

  try {
    const orderDetail = await Order.findById(historyId)
      .populate({
        path: "products.productId",
        model: "Product",
        select: "name imageUrl price",
      })
      .exec();

    if (!orderDetail) {
      return res.status(404).json({ message: "Order Not Found!" });
    }

    const formattedCart = orderDetail.products.map((item) => {
      return {
        idProduct: item.productId._id,
        nameProduct: item.productId.name,
        priceProduct: item.price,
        count: item.count,
        img: item.productId.img1,
      };
    });

    const responseData = {
      userId: orderDetail.user,
      fullname: orderDetail.deliveryInfo.fullname,
      phone: orderDetail.deliveryInfo.phone,
      address: orderDetail.deliveryInfo.address,
      total: orderDetail.total,
      cart: formattedCart,
    };

    return res.status(200).json(responseData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getAllHistory = async (req, res, next) => {
  try {
    const allOrders = await Order.find().sort({ createdAt: -1 }).select("-__v");

    if (!allOrders || allOrders.length === 0) {
      return res.status(200).json([]);
    }

    const formattedOrders = allOrders.map((order) => {
      return {
        _id: order._id,
        idUser: order.user,
        fullname: order.deliveryInfo.fullname,
        phone: order.deliveryInfo.phone,
        address: order.deliveryInfo.address,
        total: order.total,
        delivery: order.delivery || false,
        status: order.status || false,
      };
    });

    return res.status(200).json(formattedOrders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const nodemailer = require("nodemailer");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

//
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "test@gmail.com",
    pass: "123456",
  },
});

exports.postOrder = async (req, res, next) => {
  const { userId, fullname, email, phone, address, total } = req.query;

  try {
    const user = await User.findById(userId).populate("cart.items.productId");

    if (!user || user.cart.items.length === 0) {
      return res.status(404).json({ message: "User or Cart not Found!" });
    }

    const cartProducts = user.cart.items;

    for (const item of cartProducts) {
      if (item.productId.count < item.count) {
        return res.status(400).json({
          message: `Product ${item.productId.name} chỉ còn ${item.productId.count} product.`,
        });
      }
    }

    const orderItems = cartProducts.map((item) => ({
      productId: item.productId._id,
      count: item.count,
      price: item.productId.price,
    }));

    const newOrder = new Order({
      user: userId,
      deliveryInfo: { fullname, email, phone, address },
      total: total,
      products: orderItems,
    });

    await newOrder.save();

    const updatePromises = cartProducts.map((item) => {
      return Product.findByIdAndUpdate(item.productId._id, {
        $inc: { count: -item.count },
      });
    });

    await Promise.all(updatePromises);

    user.cart.items = [];
    await user.save();

    const productRows = cartProducts
      .map(
        (item) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.productId.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">
           <img src="${item.productId.imageUrl[0]}" width="50" />
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.productId.price.toLocaleString()} VND</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.count}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${(item.productId.price * item.count).toLocaleString()} VND</td>
      </tr>`,
      )
      .join("");

    const mailOptions = {
      from: "SHOP",
      to: email,
      subject: "XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG",
      html: `
        <h1>Xin chào ${fullname}</h1>
        <p>Phone: ${phone}</p>
        <p>Address: ${address}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
        <h2>Tổng thanh toán: ${total.toLocaleString()} VND</h2>
        <p>Cảm ơn bạn!</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Email Error:", error.message);
      }

      console.log("Email sent successfully!");
      console.log("Email ID: %s", info.messageId);
      console.log("Server Response: %s", info.response);
    });

    res
      .status(201)
      .json({ message: "Order Successfully!", orderId: newOrder._id });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

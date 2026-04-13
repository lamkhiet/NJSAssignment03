const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

//
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email Not Found!" });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({ message: "Password is not valid!" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      token: token,
      userId: user._id.toString(),
      fullname: user.fullname,
      role: user.role,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.postSignup = async (req, res, next) => {
  const { fullname, email, password, phone, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: role || 0,
    });

    await user.save();

    res.status(201).json({ message: "Created user successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(201).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDetailData = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
    }

    return res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUpdate = async (req, res, next) => {
  const { userId, fullname, email, phone, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    user.fullname = fullname;
    user.email = email;
    user.phone = phone;
    user.role = role;

    await user.save();
    res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Deleted user successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

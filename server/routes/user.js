const express = require("express");
const { param, body, validationResult } = require("express-validator");

const userController = require("../controllers/user");
const authMiddleware = require("../middleware/isAuth");
const User = require("../models/user");

//
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const signupValidation = [
  body("fullname").notEmpty().withMessage("Fullname is not empty!"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (user) {
        return Promise.reject("Email is existed!");
      }
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must have 5 characters!")
    .trim(),
  body("phone").notEmpty().withMessage("Phone number is required!"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (!user) {
        return Promise.reject("Email Not Found!");
      }
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must have 5 characters!")
    .trim(),
];

const updateValidation = [
  body("userId").isMongoId().withMessage("User Id is not valid"),
  body("fullname").notEmpty().withMessage("Fullname not empty!"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) return Promise.reject("Email is already in use!");
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must have 5 characters!")
    .trim(),
];

const router = express.Router();

router.post("/signup", signupValidation, validate, userController.postSignup);

router.post("/login", loginValidation, validate, userController.postLogin);

router.get(
  "/:userId",
  [param("userId").isMongoId().withMessage("User Id is not valid")],
  validate,
  userController.getDetailData,
);

// Admin
router.get(
  "",
  authMiddleware.isAuth,
  authMiddleware.isAdmin,
  userController.getAllData,
);

router.post(
  "/update",
  authMiddleware.isAuth,
  authMiddleware.isAdmin,
  userController.postUpdate,
);

router.delete(
  "/delete/:userId",
  authMiddleware.isAuth,
  authMiddleware.isAdmin,
  [param("userId").isMongoId().withMessage("User Id is not valid")],
  validate,
  userController.deleteUser,
);

//
module.exports = router;

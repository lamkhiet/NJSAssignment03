const express = require("express");
const { query, validationResult } = require("express-validator");

const checkoutController = require("../controllers/checkout");

//
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validation = [
  query("fullname").trim().notEmpty().withMessage("Fullname is not empty!"),
  query("email").isEmail().withMessage("Email is not valid!").normalizeEmail(),
  query("phone")
    .isLength({ min: 10, max: 11 })
    .withMessage("Phone number 10-11 characters!"),
  query("address").notEmpty().withMessage("Address must have!"),
  query("userId").isMongoId().withMessage("User Id is not valid!"),
];

const router = express.Router();

router.post("", validation, validate, checkoutController.postOrder);

//
module.exports = router;

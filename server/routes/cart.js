const express = require("express");
const { query, validationResult } = require("express-validator");

const cartController = require("../controllers/cart");

//
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateCartAction = [
  query("productId").isMongoId().withMessage("Product Id is not valid!"),
  query("count").isInt({ gt: 0 }).withMessage("Count >= 0!"),
  query("userId").isMongoId().withMessage("User ID is not valid!"),
];

const router = express.Router();

router.get(
  "",
  [query("userId").isMongoId().withMessage("User ID is not valid!")],
  validate,
  cartController.getCart,
);

router.post("/add", validateCartAction, validate, cartController.addToCart);

router.delete(
  "/delete",
  [
    query("productId").isMongoId().withMessage("Product Id is not valid!"),
    query("userId").isMongoId().withMessage("User Id is not valid!"),
  ],
  validate,
  cartController.deleteFromCart,
);

router.put("/update", validateCartAction, validate, cartController.updateCart);

//
module.exports = router;

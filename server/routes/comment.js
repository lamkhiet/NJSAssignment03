const express = require("express");
const { body, query, validationResult } = require("express-validator");

const commentController = require("../controllers/comment");

//
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const router = express.Router();

router.get(
  "/",
  [query("productId").isMongoId().withMessage("Product Id is not valid")],
  validate,
  commentController.getCommentProduct,
);

router.post(
  "/send",
  [
    body("productId").isMongoId().withMessage("Product Id is not valid"),
    body("userId").notEmpty().withMessage("User ID is not emprty!"),
    body("content").notEmpty().withMessage("Content is not emprty!"),
    body("star").isInt({ min: 1, max: 5 }).withMessage("1<= Star <=5"),
  ],
  validate,
  commentController.postCommentProduct,
);

//
module.exports = router;

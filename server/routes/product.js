const express = require("express");
const { query, body, param, validationResult } = require("express-validator");

const productController = require("../controllers/product");

//
const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("", productController.getAllProducts);

router.get(
  "/category",
  [query("category").notEmpty().withMessage("Category is not empty!")],
  validate,
  productController.getCategory,
);

router.get(
  "/pagination",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page > 0"),
    query("count").optional().isInt({ min: 1 }).withMessage("Count >0"),
  ],
  validate,
  productController.getPagination,
);

router.get(
  "/:productId",
  [param("productId").isMongoId().withMessage("Product Id is not valid")],
  validate,
  productController.getDetail,
);

router.post(
  "/create",
  [
    body("name").trim().notEmpty().withMessage("Name is not empty!"),
    body("category").trim().notEmpty().withMessage("Category is not empty!"),
    body("short_desc")
      .trim()
      .notEmpty()
      .withMessage("Short Desc is not empty!"),
    body("long_desc").trim().notEmpty().withMessage("Long Desc is not empty!"),
  ],
  validate,
  productController.postCreateProduct,
);

router.put("/update/:productId", productController.putUpdateProduct);

router.delete("/delete/:productId", productController.deleteProduct);
//
module.exports = router;

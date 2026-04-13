const express = require("express");
const { query, param, validationResult } = require("express-validator");

const historyController = require("../controllers/history");

//
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const router = express.Router();

router.get("/all", historyController.getAllHistory);

router.get(
  "",
  [
    query("userId")
      .notEmpty()
      .withMessage("User Id is not empty!")
      .isMongoId()
      .withMessage("User Id is not valid!"),
  ],
  validate,
  historyController.getHistory,
);

router.get(
  "/:historyId",
  [param("historyId").isMongoId().withMessage("History Id is not valid!")],
  validate,
  historyController.getDetailHistory,
);

//
module.exports = router;

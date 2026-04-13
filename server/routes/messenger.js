const express = require("express");
const { query, param, validationResult } = require("express-validator");

const messengerController = require("../controllers/messenger");

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
  "/:roomId",
  [
    param("roomId")
      .notEmpty()
      .withMessage("Room ID is not empty!")
      .isMongoId()
      .withMessage("Room ID is not valid!"),
  ],
  validate,
  messengerController.getMessage,
);

router.post(
  "/send",
  [
    query("roomId").isMongoId().withMessage("Room ID is not empty!"),
    query("message").trim().notEmpty().withMessage("Message is not empty!"),
    query("is_admin").isBoolean().withMessage("No Authorization!"),
  ],
  validate,
  messengerController.postMessage,
);

router.post(
  "/conversation",
  [
    query("email")
      .isEmail()
      .withMessage("Email is not valid!")
      .notEmpty()
      .withMessage("Email is not empty!"),
  ],
  validate,
  messengerController.postConversation,
);

//
module.exports = router;

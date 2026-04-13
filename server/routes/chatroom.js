const express = require("express");
const { body, query, validationResult } = require("express-validator");

const chatroomController = require("../controllers/chatroom");

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
  "/getById",
  [
    query("roomId")
      .notEmpty()
      .withMessage("Room Id is not empty!")
      .isMongoId()
      .withMessage("Room Id is not valid!"),
  ],
  validate,
  chatroomController.getMessageByRoomId,
);

router.post("/createNewRoom", chatroomController.createNewRoom);

router.put(
  "/addMessage",
  [
    body("roomId")
      .notEmpty()
      .withMessage("Room Id is not empty!")
      .isMongoId()
      .withMessage("Room Id is not valid!"),
    body("message").notEmpty().withMessage("Messege is not empty!").trim(),
  ],
  validate,
  chatroomController.addMessage,
);

router.get("/getAllRoom", chatroomController.getAllRoom);

//
module.exports = router;

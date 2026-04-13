const Comment = require("../models/comment");

//
exports.getCommentProduct = async (req, res) => {
  const { productId } = req.query;

  try {
    const comments = await Comment.find({ productId: productId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.postCommentProduct = async (req, res) => {
  const { productId, userId, fullname, content, star } = req.query;

  try {
    const newComment = new Comment({
      productId,
      userId,
      fullname,
      content,
      star: parseInt(star),
    });

    await newComment.save();
    res.status(201).json({ message: "Comment Successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

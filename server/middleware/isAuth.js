const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(500).json({ message: "Token is invalid." });
  }
  if (!decodedToken) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  req.userId = decodedToken.userId;
  req.role = decodedToken.role;
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.role !== 2) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

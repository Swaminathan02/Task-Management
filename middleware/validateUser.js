// Validation middleware

module.exports = (req, res, next) => {
  const userId = req.headers["user-id"];
  if (!userId) {
    return res.status(401).json({ message: "User ID required in headers" });
  }
  req.userId = userId;
  next();
};

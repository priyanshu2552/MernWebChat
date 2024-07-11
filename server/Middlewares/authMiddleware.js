require('dotenv').config();
const jwt = require("jsonwebtoken");
const AuthMiddleware = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res
      .status(400)
      .json({ message: "token Not Found User is not Authorised" });
  }
  token = token.replace("Bearer ", "");
  try {
    const isVerified = jwt.verify(token, process.env.MY_SECRET_KEY);
    req.user=isVerified;
    next();
  } catch (err) {
    console.log(err, "error in verifying");
  }
};
module.exports = AuthMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Autorisation token required" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    console.log(_id);

    req.user = await User.findOne({ _id }).select("_id name followings");
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
};

module.exports = requireAuth;

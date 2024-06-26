const User = require("../models/users");
const jwt = require("jsonwebtoken");
const Signup = async (req, res) => {
  const { username, email, phone, password, confirmpassword } = req.body;

  if (!username || !email || !phone || !password || !confirmpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existuser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });
    if (existuser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newuser = new User({
      username,
      email,
      phone,
      password,
    });

    await newuser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are neccesarry" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isvalidPassword = await user.comparePassword(password);
    if (!isvalidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, "mynameispriyanshu", {
      expiresIn: "1d",
    });
    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { Signup, Login };

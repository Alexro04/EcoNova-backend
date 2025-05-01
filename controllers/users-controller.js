const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function registerUser(req, res, next) {
  try {
    const { fullname, email, password, nationality, phoneNumber } = req.body;

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      fullname,
      email,
      role: "guest",
      nationality,
      phoneNumber,
      password: hasedPassword,
    });

    //return response
    if (newUser)
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    else throw new Error("Error registering user");
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}-An error occured at the backend`,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    //check the database for existing user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User with this email is not registered",
      });

    // if user exist, verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    //if it matches, create an access token
    const accessToken = jwt.sign(
      {
        fullname: user.fullname,
        email,
        role: user.role,
        nationality: user.nationality,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 43200 }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getAllUsers(req, res) {
  const users = await User.find();
  return res.status(200).json({ data: users });
}

module.exports = { registerUser, loginUser, getAllUsers };

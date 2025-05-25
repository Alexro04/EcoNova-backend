const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function getEmailTemplate(link) {
  return `
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50;">Welcome to EcoNova Hotel Management System</h2>
      
      <p style="color: #333333; font-size: 16px;">
        You have been added as an <strong>admin user</strong> to the EcoNova Hotel Management System.
      </p>
      
      <p style="color: #333333; font-size: 16px;">
        Use the link below to verify your account:
      </p>
      
      <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Your Account</a>
      
      <p style="color: #333333; font-size: 16px;">
        Your default password is: <strong>adminuser</strong>
      </p>
      
      <p style="color: #333333; font-size: 16px;">
        Please log in immediately after verification to change your default password to something more secure.
      </p>
      
      <p style="color: #999999; font-size: 14px; margin-top: 30px;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all;">${link}</span>
      </p>
    </div>
  </body>
`;
}

async function registerUser(req, res, next) {
  try {
    const {
      fullname,
      email,
      password,
      nationality,
      phoneNumber,
      nationalId,
      role,
    } = req.body;

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      fullname,
      email,
      role,
      status: "awaiting verification",
      nationality,
      phoneNumber,
      nationalId,
      password: hasedPassword,
    });

    //return response
    if (newUser) {
      //create a token for email confirmation (verification)
      const token = jwt.sign(
        { id: newUser._id, email },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: "1d" }
      );

      // send the token to the email of the new admin user
      const url = `http://localhost:3000/verify-email/${token}`;
      await transporter.sendMail({
        to: newUser.email,
        subject: "Verify Your Email",
        html: getEmailTemplate(url),
      });
      return res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } else throw new Error("Error registering user");
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

    // get decoded info for immdeiate login
    const decodedInfo = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      access_token: accessToken,
      user_data: decodedInfo,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getUser(req, res) {
  if (req.userInfo)
    return res.status(200).json({ success: true, user_data: req.userInfo });
  else return res.status(500).json({ success: false, message: error.message });
}

async function createGuest(req, res) {
  try {
    const { fullname, email, nationality, phoneNumber, nationalId } = req.body;

    //create new guest user - a guest user is one that comes to the hotel manually, and the employee has to book the room for them on spot
    const newUser = await User.create({
      fullname,
      email,
      role: "guest",
      nationality,
      phoneNumber,
      nationalId,
    });

    //return response
    if (newUser)
      return res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    else throw new Error("Error registering user");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}-An error occured at the backend`,
    });
  }
}

async function getAllUsers(req, res) {
  const users = await User.find();
  return res.status(200).json({ data: users });
}

async function verifyEmail(req, res) {
  try {
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json("Invalid link");

    user.status = "verified";
    await user.save();

    res.send("Email verified successfully!");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  createGuest,
  getUser,
  verifyEmail,
};

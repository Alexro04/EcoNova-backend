const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const getEmailTemplate = require("../helpers/emailTemplate");
const {
  deleteFromCloudinary,
  uploadToCollection,
} = require("../helpers/cloudinary");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function registerUser(req, res) {
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

    if (newUser) {
      //create a token for email confirmation (verification)
      const token = jwt.sign(
        { id: newUser._id, email },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: "1d" }
      );

      // send the token to the email of the new admin user
      const url = `http://localhost:3000/econova/api/auth/verify-email/${token}`;
      await transporter.sendMail({
        to: newUser.email,
        subject: "Verify Your Email",
        html: getEmailTemplate(url),
      });
      return res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } else throw new Error("Error registering user");
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
        id: user._id,
        fullname: user.fullname,
        email,
        role: user.role,
        nationality: user.nationality,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 43200 }
    );

    const user_data = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      nationality: user.nationality,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar.url,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      access_token: accessToken,
      user_data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateUserPassword(req, res) {
  const { userId } = req.params;
  const { oldPassword, password } = req.body;

  const user = await User.findById(userId);
  if (!user)
    return res.status(400).json({
      success: false,
      message: "User with this email is not registered",
    });

  // if user exist, verify password
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match)
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });

  //hash new password and store in database
  const salt = await bcrypt.genSalt(10);
  const newHasedPassword = await bcrypt.hash(password, salt);

  user.password = newHasedPassword;
  console.log(newHasedPassword, "hash");

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
}

async function updateUserData(req, res) {
  const { userId } = req.params;
  const { fullname, phoneNumber } = req.body;
  console.log(req.body);

  const user = await User.findById(userId);
  if (!user)
    return res.status(400).json({
      success: false,
      message: "User with this email is not registered",
    });

  if (fullname) user.fullname = fullname;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  if (req.file) {
    //delete current avatar from cloudinary if it exists
    console.log(req.file);
    if (user.avatar?.publicId)
      await deleteFromCloudinary(user.avatar?.publicId);
    // upload new avatar to cloudinary and update database
    const result = await uploadToCollection(req.file.path, "User_Avatars");
    user.avatar = { publicId: result.public_id, url: result.secure_url };
  }
  await user.save();

  return res
    .status(201)
    .json({ success: true, message: "User's data updated successfully" });
}

async function getUser(req, res) {
  const { id } = req.userInfo;
  try {
    const { fullname, email, role, nationality, phoneNumber, avatar } =
      await User.findById(id);
    const user_data = {
      id,
      fullname,
      email,
      role,
      nationality,
      phoneNumber,
      avatar: avatar.url,
    };
    return res.status(200).json({ success: true, user_data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
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

async function getUsers(req, res) {
  try {
    const role = req.params.role;
    const users = await User.find(role ? { role } : {});
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occured at the backend-${error.message}`,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json("Invalid link");

    user.status = "verified";
    await user.save();

    res.send("Email verified successfully!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid or expired token");
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  createGuest,
  getUser,
  verifyEmail,
  updateUserPassword,
  updateUserData,
};

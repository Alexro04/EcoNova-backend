const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  createGuest,
  getUser,
  verifyEmail,
} = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-guest", createGuest);
router.get("/verify-email/:token", verifyEmail);
router.get("/all-users", getAllUsers);
router.get("/user", authMiddleware, getUser);

module.exports = router;

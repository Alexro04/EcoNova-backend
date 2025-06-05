const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  createGuest,
  getUser,
  verifyEmail,
  updateUserData,
  updateUserPassword,
} = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const upload = require("../middlewares/multer");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router();

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-guest", createGuest);
router.post(
  "/update-data/:userId",
  authMiddleware,
  upload.single("avatar"),
  updateUserData
);
router.post("/update-password/:userId", authMiddleware, updateUserPassword);
router.get("/verify-email/:token", verifyEmail);
router.get("/users/:role", authMiddleware, adminMiddleware, getUsers);
router.get("/user", authMiddleware, getUser);

module.exports = router;

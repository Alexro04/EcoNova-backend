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

const router = express.Router();

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-guest", createGuest);
router.post("/update-data/:userId", upload.single("avatar"), updateUserData);
router.post("/update-password/:userId", updateUserPassword);
router.get("/verify-email/:token", verifyEmail);
router.get("/users/:role", getUsers);
router.get("/user", authMiddleware, getUser);

module.exports = router;

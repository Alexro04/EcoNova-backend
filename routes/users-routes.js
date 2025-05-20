const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  createGuest,
} = require("../controllers/users-controller");

const router = express.Router();

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-guest", createGuest);
router.get("/all-users", getAllUsers);

module.exports = router;

const express = require("express");
const {
  getSettings,
  createSettings,
  updateSettings,
} = require("../controllers/settings-controller");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.use(authMiddleware);

//route
router.get("/get", getSettings);
router.post("/create", adminMiddleware, createSettings);
router.post("/update", adminMiddleware, updateSettings);

module.exports = router;

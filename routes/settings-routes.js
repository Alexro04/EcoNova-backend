const express = require("express");
const {
  getSettings,
  createSettings,
  updateSettings,
} = require("../controllers/settings-controller");

const router = express.Router();

//route
router.get("/get", getSettings);
router.post("/create", createSettings);
router.post("/update", updateSettings);

module.exports = router;

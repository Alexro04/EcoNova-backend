const express = require("express");
const upload = require("../middlewares/multer");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const {
  addCabin,
  getAllCabins,
  getCabin,
  deleteCabin,
  updateCabin,
} = require("../controllers/cabins-controller");

const router = express.Router();

// routes
router.post("/upload", upload.array("cabinImages", 10), addCabin);
router.get("/all-cabins", getAllCabins);
router.get("/cabin/:cabinId", getCabin);
router.delete("/delete/:cabinId", deleteCabin);
router.post("/update/:cabinId", upload.array("cabinImages", 10), updateCabin);

module.exports = router;

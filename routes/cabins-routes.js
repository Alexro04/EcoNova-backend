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
router.post(
  "/upload",
  authMiddleware,
  upload.array("cabin-images", 10),
  addCabin
);
router.get("/all-cabins", authMiddleware, getAllCabins);
router.get("/cabin/:cabinId", authMiddleware, getCabin);
router.delete("/delete/:cabinId", deleteCabin);
router.post("/update/:cabinId", upload.array("cabin-images"), updateCabin);

module.exports = router;

const express = require("express");
const {
  addCabin,
  getAllCabins,
  getCabin,
  deleteCabin,
  updateCabin,
} = require("../controllers/cabins-controller");
const upload = require("../middlewares/multer");

const router = express.Router();

// routes
router.post("/upload", upload.array("cabin-images", 10), addCabin);
router.get("/all-cabins", getAllCabins);
router.get("/cabin/:cabinId", getCabin);
router.delete("/delete/:cabinId", deleteCabin);
router.post("/update/:cabinId", upload.array("cabin-images"), updateCabin);

module.exports = router;

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

router.use(authMiddleware);

// routes
router.post(
  "/upload",
  adminMiddleware,
  upload.array("cabinImages", 10),
  addCabin
);
router.get("/all-cabins", getAllCabins);
router.get("/cabin/:cabinId", getCabin);
router.delete("/delete/:cabinId", adminMiddleware, deleteCabin);
router.post(
  "/update/:cabinId",
  adminMiddleware,
  upload.array("cabinImages", 10),
  updateCabin
);

module.exports = router;

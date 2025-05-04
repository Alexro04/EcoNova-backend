const Cabin = require("../models/Cabin");
const {
  uploadToCollection,
  deleteFromCloudinary,
} = require("../helpers/cloudinary");

async function getAllCabins(req, res) {
  try {
    const cabins = await Cabin.find();
    if (cabins.length > 0)
      return res.status(200).json({
        success: true,
        message: "Loaded all cabins successfully",
        data: cabins,
      });
    else
      return res.status(400).json({
        success: false,
        message: "No Cabin in the database.",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

async function getCabin(req, res) {
  try {
    const { cabinId } = req.params;
    if (!cabinId)
      return res
        .status(400)
        .json({ success: false, message: "Cabin Id is required" });

    const cabin = await Cabin.findById(cabinId);

    if (cabin)
      return res.status(200).json({
        success: true,
        message: "Loaded all cabin successfully",
        data: cabin,
      });
    else
      return res.status(400).json({
        success: false,
        message: "No cabin with this Id was found in the database.",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

async function addCabin(req, res) {
  try {
    console.log(req.body);
    const { name, price, discount, capacity, description } = req.body;
    const cabinImages = req.files;
    let cabinPictures = [];

    // add all pictures to cloudinary if they exist
    if (cabinImages.length > 0) {
      for (i = 0; i < cabinImages.length; i++) {
        const result = await uploadToCollection(
          cabinImages[i].path,
          "EcoNova_cabins"
        );
        cabinPictures.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    } else
      throw new Error("You need at least one cabin image to upload a cabin");

    // create new cabin
    const newCabin = await Cabin.create({
      name,
      price,
      capacity,
      description,
      discount,
      cabinPictures,
    });

    if (newCabin)
      return res
        .status(201)
        .json({ success: true, message: "New Cabin uploaded successfully" });
    else throw new Error("Error occured while uploading cabin");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

async function deleteCabin(req, res) {
  try {
    const { cabinId } = req.params;
    const cabin = await Cabin.findById(cabinId);

    //delete all cabin pictures from cloudinary
    for (i = 0; i < cabin.cabinPictures.length; i++) {
      await deleteFromCloudinary(cabin.cabinPictures[i].publicId);
    }

    // delete cabin from database
    const deletedCabin = await Cabin.findByIdAndDelete(cabinId);
    if (deletedCabin)
      return res.status(200).json({
        success: true,
        message: `Cabin with ID: ${cabinId} deleted successfully`,
      });
    else throw new Error("Error deleting cabin");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

async function updateCabin() {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

module.exports = { getAllCabins, getCabin, addCabin, deleteCabin, updateCabin };

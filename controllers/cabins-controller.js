const Cabin = require("../models/Cabin");
const {
  deleteImagesFromCloudinary,
  addImagesToCloudinary,
  duplicateImageInCloudinary,
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
    const { name, price, discount, capacity, description } = req.body;
    const cabinImages = req.files;
    let cabinPictures;

    //for duplicating cabins, check if the body already contains cabinPictures
    if (req.body.cabinPictures)
      cabinPictures = await duplicateImageInCloudinary(
        JSON.parse(req.body.cabinPictures)
      );
    // add all pictures to cloudinary if they exist
    else cabinPictures = await addImagesToCloudinary(cabinImages);

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
    await deleteImagesFromCloudinary(cabin.cabinPictures);

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

async function updateCabin(req, res) {
  try {
    const { cabinId } = req.params;
    const { name, price, discount, capacity, description } = req.body;
    const cabinImages = req.files;

    //check if cabin exists
    const cabin = await Cabin.findById(cabinId);
    if (!cabin)
      return res.status(400).json({
        success: false,
        message: `Cabin with the id-${cabinId} does not exist.`,
      });

    // if cabin exists, update the values
    if (req.body) {
      cabin.name = name;
      cabin.price = price;
      cabin.discount = discount;
      cabin.capacity = capacity;
      cabin.description = description;
    }

    // if files exists, overwrite the current one
    if (cabinImages?.length > 0) {
      await deleteImagesFromCloudinary(cabin.cabinPictures);
      const newImages = await addImagesToCloudinary(cabinImages);
      cabin.cabinPictures = newImages;
    }

    await cabin.save();
    res.status(200).json({
      success: true,
      message: `Cabin with id-${cabinId} updated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

module.exports = { getAllCabins, getCabin, addCabin, deleteCabin, updateCabin };

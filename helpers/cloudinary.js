const cloudinary = require("cloudinary").v2;

// Configure your Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to a specific collection
async function uploadToCollection(imagePath, collectionName) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: collectionName,
    });
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Upload to cloudinary storage failed");
  }
}

async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Deleting from cloudinary storage failed");
  }
}

async function addImagesToCloudinary(imageArray) {
  let pictures = [];

  if (imageArray.length > 0) {
    for (i = 0; i < imageArray.length; i++) {
      const result = await uploadToCollection(
        imageArray[i].path,
        "EcoNova_cabins"
      );
      pictures.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  } else throw new Error("Image Array is empty");

  return pictures;
}

async function deleteImagesFromCloudinary(imageArray) {
  if (imageArray.length > 0) {
    for (i = 0; i < imageArray.length; i++) {
      await deleteFromCloudinary(imageArray[i].publicId);
    }
  } else throw new Error("Image Array is empty");
}

module.exports = {
  uploadToCollection,
  deleteFromCloudinary,
  addImagesToCloudinary,
  deleteImagesFromCloudinary,
};
// Usage example
// uploadToCollection("./images/my_image.jpg", "EcoNova_cabins");

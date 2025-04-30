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
  }
}

module.exports = { uploadToCollection };
// Usage example
// uploadToCollection("./images/my_image.jpg", "EcoNova_cabins");

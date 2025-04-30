const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database successfully.");
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
}

module.exports = connectToDatabase;

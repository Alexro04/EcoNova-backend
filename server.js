require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./db/db");

const app = express();

//connect to database
connectToDatabase();

// use middleware to parse json
app.use(express.json());

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

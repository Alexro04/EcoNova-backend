require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./db/db");

const cabinRoutes = require("./routes/cabins-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

//connect to database
connectToDatabase();

// use middleware to parse json
app.use(express.json());

// routes
app.use("/econova/api/cabins/", cabinRoutes);
app.use("/econova/api/users/", userRoutes);

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

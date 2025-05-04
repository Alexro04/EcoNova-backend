require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./db/db");
const cors = require("cors");

const cabinRoutes = require("./routes/cabins-routes");
const userRoutes = require("./routes/users-routes");
const bookingRoutes = require("./routes/booking-routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

//connect to database
connectToDatabase();

// use middleware to parse json
app.use(express.json());

// routes
app.use("/econova/api/cabins/", cabinRoutes);
app.use("/econova/api/users/", userRoutes);
app.use("/econova/api/bookings/", bookingRoutes);

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

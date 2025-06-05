require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./db/db");
const cors = require("cors");

const cabinRoutes = require("./routes/cabins-routes");
const authRoutes = require("./routes/auth-routes");
const bookingRoutes = require("./routes/booking-routes");
const settingsRoutes = require("./routes/settings-routes");

const app = express();

app.use(
  cors({
    origin: "https://econova.vercel.app",
  })
);

//connect to database
connectToDatabase();

// use middleware to parse json
app.use(express.json());

// routes
app.use("/api/cabins/", cabinRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/bookings/", bookingRoutes);
app.use("/api/settings/", settingsRoutes);

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

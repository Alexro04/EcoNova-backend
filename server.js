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
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://lexeconova.netlify.app",
        "https://6842de2b64d14abc58f44cd2--lexeconova.netlify.app/login",
        "https://econova.vercel.app",
        "https://econova-oluwatomis-projects.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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

// Imports
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const PORT = process.env.PORT || 8000;

// API
const users = require("./api/users");

// Middleware
app.use(cors()); // related to api
app.use(express.urlencoded({ extended: false })); // take data in from a form
app.use(express.json()); // for parsing json

// Initialize Passport and use config file
app.use(passport.initialize());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Smile, you are being watched by the Backend Engineering Team",
  });
});

// Routes
app.use("/api/users", users);

app.get("/*", (req, res) => {
  res.status(404).json({ message: "Data not found" });
});

app.listen(PORT, () => {
  console.log(`Server is listening 🎧 on port: ${PORT}`);
});

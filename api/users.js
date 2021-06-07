// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JWT_SECRET = process.env.JWT_SECRET;

// Models
const { User } = require("../models");

// controllers
const test = async (req, res) => {
  res.json({ message: "User endpoint OK!" });
};

const signup = async (req, res) => {
  console.log("- - - INSIDE OF SIGNUP - - -");
  console.log("req.body =>", req.body);
  const { name, email, password } = req.body;
  try {
    // see if a user exists in the db by email and password
    const user = await User.findOne({ email });

    // if a user exists return 400 error and message
    if (user) {
      return res.status(400).json({ message: "Email already exists!" });
    } else {
      console.log("Create a new user");
      let saltRounds = 12;
      let salt = await bcrypt.genSalt(saltRounds);
      let hash = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hash,
      });

      const savedNewUser = await newUser.save();
      res.json(savedNewUser);
    }
  } catch (error) {
    console.log("Error inside of /api/users/signup");
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error occurred. Please try again." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // if no user exists
    if (!user) {
      return res
        .status(400)
        .json({ message: "Either email or password is incorrect." });
    } else {
      // a user is found in the database
      let isMatch = await bcrypt.compare(password, user.password);
      console.log("Password correct: ", isMatch);

      if (isMatch) {
        // add one to timesLoggedIn
        let logs = user.timesLoggedIn + 1;
        user.timesLoggedIn = logs;
        const savedUser = await user.save();
        // create a token payload (object)
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          expiredToken: Date.now(),
        };
        try {
          // if token is generated
          let token = await jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }); // token good for an hour
          let legit = await jwt.verify(token, JWT_SECRET, { expiresIn: 60 }); // has 60 seconds to verify
          res.json({
            success: true,
            token: `Bearer ${token}`,
            userData: legit,
          });
        } catch (error) {
          console.log("Error inside of isMatch conditional");
          console.log(error);
          res
            .status(400)
            .json({ message: "Session has ended. Please log in again." });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Either email or password is incorrect." });
      }
    }
  } catch (error) {}
};

// routes
router.get("/test", test); // run if you hit /api/users/test

// POST api/users/register (Public)
router.post("/signup", signup);

// POST api/users/login (Public)
router.post("/login", login);

// GET api/users/current (Private)
// router.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   profile
// );
// router.get('/all-users', fetchUsers);

module.exports = router;

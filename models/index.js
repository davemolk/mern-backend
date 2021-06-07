require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

// set up event for db to print connection
db.once("open", () => {
  console.log(`Connect to MongoDB at ${db.host}:${db.port}`);
});

db.on("error", (error) => {
  console.log("Database error", error);
});

// import all of your models
const User = require("./User");

// export all of your models
module.exports = {
  User,
};

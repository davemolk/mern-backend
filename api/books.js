// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
// Models
const { Book } = require("../models");
// Controllers
const index = async (req, res) => {
  console.log("inside of /api/books");
  try {
    const allBooks = await Book.find({});
    res.json({ books: allBooks });
  } catch (error) {
    console.log("Error inside of /api/books");
    console.log(error);
    return res
      .status(400)
      .json({ message: "Books not found. Please try again." });
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    res.json({ book });
  } catch (error) {
    console.log("Error inside of /api/books/:id");
    console.log(error);
    return res.status(400).json({ message: "Book not found. Try again...." });
  }
};

const create = async (req, res) => {
  const { title, author, price, pages, isbn, genre } = req.body;
  try {
    const newBook = await Book.create(req.body);
    console.log("Book was created", newBook);
    res.json({ book: newBook });
  } catch (error) {
    console.log("Error inside of POST for /api/books");
    console.log(error);
    return res
      .status(400)
      .json({ message: "Book was not created. Please try again...." });
  }
};

const update = async (req, res) => {};
const deleteBook = async (req, res) => {};

// GET api/books/test (Public)
router.get("/test", (req, res) => {
  res.json({ msg: "Books endpoint OK!" });
});

router.get("/", passport.authenticate("jwt", { session: false }), index);
router.get("/:id", passport.authenticate("jwt", { session: false }), show);
// router.post('/books', passport.authenticate('jwt', { session: false }), create);
// router.put('/books/:id', passport.authenticate('jwt', { session: false }), update);
// router.delete('/books/:id', passport.authenticate('jwt', { session: false }), deleteBook);
module.exports = router;

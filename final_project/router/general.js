const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ---------------- REGISTER ----------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});

// ---------------- GET ALL BOOKS ----------------
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// ---------------- TASK 10 ----------------
// Get all books using async/await with Axios
public_users.get("/asyncbooks", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// ---------------- GET BOOK BY ISBN ----------------
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ---------------- TASK 11 ----------------
// Get book by ISBN using async/await with Axios
public_users.get("/asyncisbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ---------------- GET BOOKS BY AUTHOR ----------------
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;

  let filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// ---------------- TASK 12 ----------------
// Get books by author using async/await with Axios
public_users.get("/asyncauthor/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// ---------------- GET BOOKS BY TITLE ----------------
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;

  let filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// ---------------- TASK 13 ----------------
// Get books by title using async/await with Axios
public_users.get("/asynctitle/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// ---------------- GET REVIEWS ----------------
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

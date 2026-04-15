const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
  }

  const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
  }

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username & password provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    // Validate user
    if (!authenticatedUser(username, password)) {
      return res.status(403).json({ message: "Invalid login" });
    }
  
    // Generate JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  
    // Store token in session
    req.session.authorization = {
        token: accessToken,
      };
    return res.status(200).json({ message: "User successfully logged in" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    const username = req.user.username; // from middleware
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully" });
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    // Delete only this user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require("express"); // Imports Express.js
const router = express.Router(); // Creates an Express Router instance

// Authentication middleware
const authMiddleware = require("../MiddleWare/authMiddleWare");

// user controllers
const { login, register, checkUser } = require("../Controller/userController"); // Imports specific controller functions

// Register route: Handles creating a new user
router.post("/register", register);

// Login user: Handles user authentication
router.post("/login", login);

// Check user: Verifies user's authentication status
router.get("/check", authMiddleware, checkUser);

module.exports = router; // Exports the router to be used in app.js
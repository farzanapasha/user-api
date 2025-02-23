const express = require("express");
const loginController = require("../controllers/loginController");

const router = express.Router();

// ✅ Ensure this exists!
router.post("/login", loginController.loginUser);

module.exports = router;


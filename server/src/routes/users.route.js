const express = require("express");
const {
  signupUserController,
  signinUserController,
  getMeController,
} = require("../controller/users.controller");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();

router.post("/signup", signupUserController);
router.post("/signin", signinUserController);
router.get("/me", isAuthenticated, getMeController);
module.exports = router;

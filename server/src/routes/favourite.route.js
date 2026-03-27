const express = require("express");
const {
  addFavouriteController,
  getAllFavouriteController,
  deleteFavouriteController,
} = require("../controller/favourites.controller");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();

router.post("/add", isAuthenticated, addFavouriteController);
router.get("/all", isAuthenticated, getAllFavouriteController);
router.delete("/:id", isAuthenticated, deleteFavouriteController);

module.exports = router;

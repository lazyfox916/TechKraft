const express = require("express");
const {
  getAllPropertiesController,
} = require("../controller/property.controller");
const router = express.Router();

router.get("/all-properties", getAllPropertiesController);

module.exports = router;

const { Property } = require("../models");

exports.createPropertyController = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    if (!title || !description || !price || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating property",
      error: error.message,
    });
  }
};

exports.getAllPropertiesController = async (req, res) => {
  try {
    const properties = await Property.findAll();

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully.",
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while retrieving properties.",
      error: error.message,
    });
  }
};

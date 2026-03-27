const { Favourites, Property } = require("../models");

exports.addFavouriteController = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req._id;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const existingFavourite = await Favourites.findOne({
      where: { userId, propertyId },
    });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: "Property already in favourites",
      });
    }

    const favourite = await Favourites.create({ userId, propertyId });

    return res.status(201).json({
      success: true,
      message: "Property added to favourites",
      data: favourite,
    });
  } catch (error) {
    console.error("Error creating favourite:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllFavouriteController = async (req, res) => {
  try {
    const userId = req._id;

    const favourites = await Favourites.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          as: "property",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Favourites retrieved successfully.",
      data: favourites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while retrieving favourites.",
      error: error.message,
    });
  }
};

exports.deleteFavouriteController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Favourites.destroy({ where: { propertyId: id } });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Favourite deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

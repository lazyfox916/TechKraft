const { Model, DataTypes } = require("sequelize");
const { postgres } = require("../../config/db/connectDB");

class Favourites extends Model {}

Favourites.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    sequelize: postgres,
    modelName: "Favourites",
    tableName: "favourites",
  },
);

module.exports = Favourites;

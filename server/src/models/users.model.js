const { Model, DataTypes } = require("sequelize");
const { postgres } = require("../../config/db/connectDB");

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: [true, "Email must be unique"],
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Buyer",
    },
  },
  {
    timestamps: true,
    sequelize: postgres,
    modelName: "Users",
    tableName: "users",
  },
);

module.exports = Users;

const Users = require("./users.model");
const Property = require("./property.model");
const Favourites = require("./favourites.model");

Users.hasMany(Favourites, { foreignKey: "userId", as: "favourites" });
Favourites.belongsTo(Users, { foreignKey: "userId", as: "user" });

Property.hasMany(Favourites, { foreignKey: "propertyId", as: "favourites" });
Favourites.belongsTo(Property, { foreignKey: "propertyId", as: "property" });

module.exports = {
  Users,
  Property,
  Favourites,
};

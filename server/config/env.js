const dotenv = require("dotenv");

dotenv.config();

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  SSL,
  SECRET_KEY,
} = process.env;

module.exports = {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  SSL,
  SECRET_KEY,
};

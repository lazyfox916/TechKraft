const { Sequelize } = require("sequelize");
const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  SSL,
} = require("../env");

const postgres = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT || "postgres",
  port: DB_PORT,
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  timezone: "+05:45",
  dialectOptions: {
    ssl: SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
});

const testPostgresConnection = async () => {
  try {
    await postgres.authenticate();
    await postgres.sync({ alter: false });
    console.info(
      "\x1b[38;5;34m 👾 Postgres Database Synced Successfully. \x1b[0m",
    );
    console.info("\x1b[38;5;34m ✅ Connected to Postgres Database... \x1b[0m");
  } catch (error) {
    console.error("❌ Unable to connect to Postgres:", error);
  }
};

module.exports = { postgres, testPostgresConnection };

const fs = require("fs/promises");
const path = require("path");

const { postgres } = require("../../config/db/connectDB");

require("../models");

const Property = require("../models/property.model");

async function main() {
  const force = process.argv.includes("--force");

  await postgres.authenticate();
  await postgres.sync({ alter: false });

  const seedPath = path.join(__dirname, "../../config/db/seeds/seed.json");
  const raw = await fs.readFile(seedPath, "utf8");
  const parsed = raw ? JSON.parse(raw) : {};

  const properties = parsed.properties;
  if (!Array.isArray(properties) || properties.length === 0) {
    throw new Error(
      "No properties found in config/db/seeds/seed.json (expected { properties: [...] })",
    );
  }

  const existingCount = await Property.count();
  if (existingCount > 0 && !force) {
    console.info(
      `Properties already exist (${existingCount}). Re-run with --force to truncate and reseed.`,
    );
    await postgres.close();
    return;
  }

  if (force) {
    await Property.destroy({ where: {}, truncate: true, cascade: true });
  }

  await Property.bulkCreate(properties, { validate: true });
  console.info(`Seeded ${properties.length} properties.`);

  await postgres.close();
}

main().catch(async (error) => {
  console.error("Property seeding failed:", error);
  try {
    await postgres.close();
  } catch {}
  process.exit(1);
});

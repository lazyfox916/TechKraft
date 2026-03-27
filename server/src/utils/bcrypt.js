const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
}

async function comparePassword(password, hash) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password: " + error.message);
  }
}

module.exports = { hashPassword, comparePassword };

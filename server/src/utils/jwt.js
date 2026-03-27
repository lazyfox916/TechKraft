const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config/env");

function generateToken(payload, expiresIn) {
  try {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn });
    return token;
  } catch (error) {
    throw new Error("Error generating token: " + error.message);
  }
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Error verifying token: " + error.message);
  }
}

module.exports = { generateToken, verifyToken };

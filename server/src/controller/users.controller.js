const { Users } = require("../models");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");

exports.signupUserController = async (req, res) => {
  try {
    let data = req.body;

    const existingUser = await Users.findOne({ where: { email: data.email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(data.password);
    data = {
      ...data,
      password: hashedPassword,
    };

    const result = await Users.create(data);

    const safeUser = {
      id: result.id,
      fullname: result.fullname,
      email: result.email,
    };

    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

exports.signinUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = generateToken(
      {
        id: user.id,
      },
      "7d",
    );

    res.json({
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({
      message: "Error signing in user",
      error: error.message,
    });
  }
};

exports.getMeController = async (req, res) => {
  try {
    const userId = req._id;
    const user = await Users.findByPk(userId, {
      attributes: ["id", "fullname", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: req.user?.role || "buyer",
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

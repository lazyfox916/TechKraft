const { verifyToken } = require("../utils/jwt");

async function isAuthenticated(req, res, next) {
  try {
    let tokenString =
      req.headers.authorization || req.cookies.token || req.cookies.accessToken;

    if (!tokenString) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    if (typeof tokenString === "string" && tokenString.startsWith("Bearer ")) {
      tokenString = tokenString.split(" ")[1];
    }

    const decoded = await verifyToken(tokenString);

    req._id = decoded.id;
    req.userId = decoded.id;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    req.subDomain = decoded.subDomain;
    next();
  } catch (error) {
    const status = error && error.status ? error.status : 401;
    return res.status(status).json({
      success: false,
      message: error && error.message ? error.message : "Unauthorized",
    });
  }
}

module.exports = isAuthenticated;

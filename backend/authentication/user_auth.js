const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate access token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" } // Short expiration time for security
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Longer expiration time
  );
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
};

// Set tokens in HTTP-only cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  // Set access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// Clear auth cookies
const clearTokenCookies = (res) => {
  res.cookie("accessToken", "", { maxAge: 0 });
  res.cookie("refreshToken", "", { maxAge: 0 });
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  // Convert string to array if only one role is provided
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    // If no roles are required, allow access
    if (roles.length === 0) return next();

    // Check if user has required role
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies,
  authorize,
};

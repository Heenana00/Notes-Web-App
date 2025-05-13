const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
  clearTokenCookies,
  verifyRefreshToken,
} = require("../authentication/user_auth");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set tokens in HTTP-only cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set tokens in HTTP-only cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.logout = (req, res) => {
  // Clear auth cookies
  clearTokenCookies(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    // Verify refresh token
    const { valid, expired, decoded } = verifyRefreshToken(refreshToken);

    if (!valid) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    if (expired) {
      clearTokenCookies(res);
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new tokens in cookies
    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to refresh token" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user data" });
  }
};

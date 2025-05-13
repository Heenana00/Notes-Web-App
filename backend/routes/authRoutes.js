const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getMe,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { authorize } = require("../authentication/user_auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/me", authMiddleware, getMe);

// Example of role-based route (admin only)
router.get("/admin", authMiddleware, authorize("admin"), (req, res) => {
  res.status(200).json({ message: "Admin access granted" });
});

module.exports = router;

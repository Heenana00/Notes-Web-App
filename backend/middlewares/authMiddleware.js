const { verifyAccessToken } = require("../authentication/user_auth");

const authMiddleware = (req, res, next) => {
  // Check for token in cookies first (preferred method)
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // Fallback to Authorization header if cookie not present
  const authHeader = req.headers.authorization;
  const headerToken = authHeader ? authHeader.split(" ")[1] : null;

  // Use cookie token or header token, with refreshToken as fallback
  const token = accessToken || headerToken || refreshToken;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  // Verify the token
  const { valid, expired, decoded } = verifyAccessToken(token);

  if (!valid) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (expired) {
    return res
      .status(401)
      .json({ error: "Token expired", code: "TOKEN_EXPIRED" });
  }

  // Set user info in request object
  req.user = decoded;
  next();
};

module.exports = authMiddleware;

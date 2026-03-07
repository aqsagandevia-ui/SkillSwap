const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  console.log('[AUTH MIDDLEWARE] Called for:', req.method, req.path);
  console.log('[AUTH MIDDLEWARE] next type:', typeof next);
  
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    console.log('[AUTH MIDDLEWARE] No token provided');
    return res.status(401).json({ msg: "No token" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH MIDDLEWARE] Token verified, user id:', decoded.id || decoded.userId);
    // Handle both 'id' (regular login) and 'userId' (google login)
    req.user = {
      id: decoded.id || decoded.userId,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.log('[AUTH MIDDLEWARE] Token verification failed:', err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

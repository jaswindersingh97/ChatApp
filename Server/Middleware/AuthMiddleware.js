const jwt = require('jsonwebtoken');

// Middleware function to authorize users
const authorize = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Check if the Authorization header is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token (assuming secretKey is your secret used to sign the token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded user to the request object
    req.user = decoded;

    // Proceed to the next middleware/route
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authorize;

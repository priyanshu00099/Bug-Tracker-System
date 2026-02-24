const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
      // 1. Get the header
      const authHeader = req.headers['authorization'];
      
      if (!authHeader) {
          return res.status(401).json({ error: "Access denied. No token provided." });
      }

      // 2. Extract the token (Splits "Bearer <token_string>" and grabs the second part)
      const token = authHeader.split(' ')[1];

      if (!token) {
          return res.status(401).json({ error: "Access denied. Malformed token." });
      }

      try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request

        // 4. Verify the Role (If roles were passed in)
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. You do not have the required role." });
        }

        next();
        
      } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  };
};

module.exports = auth;
const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Malformed token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, name, role }

      if (roles.length > 0) {
        const allowedRoles = roles.map(r => r.toLowerCase());
        const userRole = req.user.role.toLowerCase();
        
        // Parse additional roles
        const userAdditionalRoles = (req.user.additional_roles || "").split(",").map(r => r.trim().toLowerCase()).filter(Boolean);
        
        const hasAccess = allowedRoles.includes(userRole) || allowedRoles.some(r => userAdditionalRoles.includes(r));
        
        if (!hasAccess) {
          return res.status(403).json({ error: "Forbidden: role not allowed" });
        }
      }
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
  };
};

module.exports = auth;
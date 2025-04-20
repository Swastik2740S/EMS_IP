const jwt = require('jsonwebtoken');
const db = require('../models');

const authenticate = (allowedRoles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.userId);
    
    if (!user) throw new Error('User not found');
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = authenticate;

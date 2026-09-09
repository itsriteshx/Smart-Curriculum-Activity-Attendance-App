/**
 * @file adminAuth.js
 * @description Dedicated Admin authorization guard middleware.
 */

const { verifyToken, authorizeRoles } = require('./authMiddleware');
const { ROLES } = require('../constants/roles');

const requireAdmin = [verifyToken, authorizeRoles(ROLES.ADMIN)];

module.exports = {
  requireAdmin,
};

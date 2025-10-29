import { ForbiddenError } from '../utils/errorHandler.js';

/**
 * Middleware to check if user has required permissions
 * @param {...string} requiredPermissions - List of required permissions
 * @returns {Function} Express middleware function
 */
const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      // If no specific permissions required, allow access
      if (requiredPermissions.length === 0) {
        return next();
      }

      // Check if user has any of the required permissions
      const hasPermission = requiredPermissions.some(permission => 
        req.user.roles?.includes(permission)
      );

      if (!hasPermission) {
        throw new ForbiddenError(
          `Required permission: ${requiredPermissions.join(' or ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user has admin role
 * @type {import('express').RequestHandler}
 */
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { checkPermission, isAdmin };

// Note: Make sure your auth middleware is adding the user object to the request
// Example auth middleware:
/*
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
*/

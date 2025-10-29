import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class TokenService {
    /**
     * Generate JWT token with user details
     * @param {string} userId - User ID
     * @param {string} email - User email
     * @param {string} role - User role
     * @returns {string} JWT token
     */
    static generateToken(userId, email, role) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return jwt.sign(
            { 
                id: userId,  // Changed from userId to id to match JWT standard
                email,
                role,
                iat: Math.floor(Date.now() / 1000) // Issued at time
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
                algorithm: 'HS256'
            }
        );
    }

    /**
     * Verify and decode JWT token
     * @param {string} token - JWT token to verify
     * @returns {Object|null} Decoded token payload or null if invalid
     */
    static verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
            throw error;
        }
    }

    /**
     * Extract user ID from token
     * @param {string} token - JWT token
     * @returns {string} User ID
     */
    static getUserIdFromToken(token) {
        const decoded = this.verifyToken(token);
        if (!decoded || !decoded.userId) {
            throw new Error('Invalid token: Missing user ID');
        }
        return decoded.userId;
    }

    /**
     * Extract user email from token
     * @param {string} token - JWT token
     * @returns {string} User email
     */
    static getUserEmailFromToken(token) {
        const decoded = this.verifyToken(token);
        if (!decoded || !decoded.email) {
            throw new Error('Invalid token: Missing email');
        }
        return decoded.email;
    }

    /**
     * Extract user role from token
     * @param {string} token - JWT token
     * @returns {string} User role
     */
    static getUserRoleFromToken(token) {
        const decoded = this.verifyToken(token);
        if (!decoded || !decoded.role) {
            throw new Error('Invalid token: Missing role');
        }
        return decoded.role;
    }

    /**
     * Get all user data from token
     * @param {string} token - JWT token
     * @returns {Object} User data { userId, email, role }
     */
    static getUserFromToken(token) {
        const decoded = this.verifyToken(token);
        if (!decoded || !decoded.userId || !decoded.email || !decoded.role) {
            throw new Error('Invalid token: Missing required user data');
        }
        return {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
    }
}

export default TokenService;

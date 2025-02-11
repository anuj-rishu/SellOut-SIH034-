const jwt = require("jsonwebtoken");
const AuthSchema = require("../models/Auth");

const checkRole = (userRole, allowedRoles) => {
    return allowedRoles.includes(userRole)
};

const authMiddleware = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            // Check if Authorization header exists
            const authHeader = req.header('Authorization');
            if (!authHeader) {
                return res.status(401).json({ 
                    message: 'No authorization token provided' 
                });
            }

            // Validate token format
            if (!authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    message: 'Invalid token format' 
                });
            }

            // Extract and verify token
            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'secretkey');
            
            // Find user
            const user = await AuthSchema.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ 
                    message: 'User not found' 
                });
            }
            
            // Check role if roles are specified
            if (allowedRoles.length > 0) {
                const hasRole = checkRole(user.domain.role, allowedRoles);
                if (!hasRole) {
                    return res.status(403).json({ 
                        message: 'Access denied. Insufficient role privileges' 
                    });
                }
            }

            req.user = user;
            next();
            
        } catch (error) {
            return res.status(401).json({ 
                message: error.message || 'Authentication failed' 
            });
        }
    };
};

module.exports = authMiddleware;
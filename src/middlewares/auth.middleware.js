
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.configration.js';


export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];
    
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, jwtConfig.accessToken);
            req.user = { userId: decoded.userId };
            return next();
        } catch (error) {
            return res.status(403).json({ 
                success: false, 
                message: "Invalid or expired access token" 
            });
        }
    }

    return res.status(401).json({ 
        success: false, 
        message: "Access token is required" 
    });
};
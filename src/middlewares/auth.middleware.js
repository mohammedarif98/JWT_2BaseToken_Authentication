
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.configration.js';
import TokenBlacklist from '../models/tokenBlacklist.model.js';


export const authenticateUser = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1];
        
        if(!accessToken){
            return res.status(401).json({ success: false, message: "Access token is required" });
        }

        const isBlackListed = await TokenBlacklist.findOne({ token: accessToken });
        if (isBlackListed) {
            return res.status(401).json({ success: false, message: "Session terminated. Please login again." });
        }

        const decoded = jwt.verify(accessToken, jwtConfig.accessToken);
        req.user = { userId: decoded.userId };
        return next();

    }catch(error){
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Access token expired" });
        }
        return res.status(403).json({ success: false, message: "Invalid access token" });
    }
};
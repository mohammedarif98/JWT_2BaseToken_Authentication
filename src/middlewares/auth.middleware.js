
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.configration.js';


export const authenticateUser = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader){
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, jwtConfig.accessToken, (error, user) => {
        if(error){
            return res.status(403).json({ success: false, message: "Fobidden- invalid token" });
        }
        req.user = user
        next()
    })
    }else{
        res.status(500).json({ success: false, message: "Unauthorized - No token provided" })
    }
}
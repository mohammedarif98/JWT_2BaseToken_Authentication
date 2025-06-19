
import jwt from "jsonwebtoken";
import jwtConfig from '../config/jwt.configration.js';



export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, jwtConfig.accessToken, { expiresIn: jwtConfig.accessTokenExpiry })
}

export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, jwtConfig.refreshToken, { expiresIn: jwtConfig.refreshTokenExpiry })
}
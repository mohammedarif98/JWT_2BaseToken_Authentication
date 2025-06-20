import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import User from '../models/user.model.js'
import jwtConfig from "../config/jwt.configration.js";
import { compareRefreshToken, hashRefreshToken } from "../utils/hashToken.js";
import jwt from "jsonwebtoken";


export const register = async(req, res) => {
    try{
        const { username, email, password, confirmPassword } = req.body;

        if( !username || !email || !password || !confirmPassword ){
            return res.status(400).json({ success: true, message: "All fields are requireds" })
        }

        if( password !== confirmPassword ){
            return res.status(400).json({ success: false, message: "passwords do not match" })
        }

        const existingUser = await User.findOne({ $or: [{username}, {email}] });
        if(existingUser){
            return res.status(409).json({ success: false, message: "user already existed with this email or username" })
        } 

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username,
            email,
            password: hashedPassword, 
        });

        const { password: userPassword, ...userResponse } = user.toObject();
        return res.status(201).json({ success: true, message: "user created successfully", data: userResponse })

    }catch(error){
        console.log("registration error:", error);
        return res.status(500).json({ success: false, message: "server error during in registration" })
    }
}



export const login = async(req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ success: false, message: "All fields are required!" })
        }

        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await comparePasswords( password, user.password )
        if(!isPasswordCorrect){
            return res.status(401).json({ success: false, message: "Invalid credential" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        
        // Save hashed refresh token to DB 
        user.refreshToken = refreshToken;
        await user.save(); 

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,      // Cannot be accessed by JavaScript (frontend code).Automatically sent by browsers/Postman in subsequent requests.
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: userPassword, refreshToken: _, ...userResponse } = user.toObject();

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { 
                accessToken,
                user: userResponse
            }
        });
    }catch(error){
        console.log("login error:", error);
        return res.status(500).json({ success: false, message: "server error during in login" })
    }
}



export const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        await User.findByIdAndUpdate(userId, { refreshToken: null, refreshTokenExpires: null });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ success: false, message: 'Server error during logout' });
    }
};



export const refreshAccessToken = async(req, res) => {
    try{
        const refreshToken = req.cookies?.["refreshToken"];
        if(!refreshToken){
            return res.status(401).json({ success: false, message: "Refresh token is required!" });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshToken);

        // Find user and verify stored refresh token matches
        const user = await User.findById({ _id: decoded.userId, refreshTokenExpires: {$gt: new Date()} }).select("+refreshToken");
        if(!user){
            return res.status(403).json({ success: false, message: "Invalid refresh token!" })
        }

        // Compare with stored hashed refresh token
        const isTokenValid = await compareRefreshToken(refreshToken, user.refreshToken)
        if(!isTokenValid){
            return res.status(403).json({ success: false, message: "Refresh token is invalid or expired" })
        }

        // generate new access token
        const newAccessToken = generateAccessToken(user._id);

        return res.status(200).json({ success: true, message: "Access token refreshed", data: { accessToken: newAccessToken } });

    }catch(error){
        console.log("error in refresh token: ", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ success: false, message: "Refresh token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        return res.status(500).json({ success: false, message: "Error refreshing access token" });
    }
}




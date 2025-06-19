import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import User from '../models/user.model.js'
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwtConfig from "../config/jwt.configration.js";



export const register = async(req, res) => {
    try{
        const { username, email, password, confirmPassword } = req.body;

        if( !username || !email || !password || !confirmPassword ){
            res.status(400).json({ success: true, message: "All fields are requireds" })
        }

        if( password !== confirmPassword ){
            res.status(400).json({ success: false, message: "passwords do not match" })
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
        res.status(201).json({ success: true, message: "user created successfully", data: userResponse })

    }catch(error){
        console.log("registration error:", error);
        res.status(500).json({ success: false, message: "server error during in registration" })
    }
}



export const login = async(req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ success: false, message: "All fields are required!" })
        }

        const user = await User.findOne({ email }).select("+password");
        if(!user){
            res.status(401).json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await comparePasswords( password, user.password )
        if(!isPasswordCorrect){
            res.status(401).json({ success: false, message: "Invalid credential" });
        }

        const accessToken = generateAccessToken(user._id);
        const refresToken = generateRefreshToken(user._id);

        await user.save(); 

        res.cookie('refreshToken', refresToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: userPassword, ...userResponse } = user.toObject();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { 
                accessToken,
                user: userResponse
            }
        });
    }catch(error){
        console.log("login error:", error);
        res.status(500).json({ success: false, message: "server error during in login" })
    }
}



export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Server error during logout' });
    }
};
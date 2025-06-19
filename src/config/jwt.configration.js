import dotenv from "dotenv"

dotenv.config();

export default {
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
}
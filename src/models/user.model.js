import  mongoose from "mongoose";
import { hashRefreshToken } from "../utils/hashToken.js";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        index: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        index: true,
        trim : true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    refreshToken: {
        type: String,
        select: false      //* Won't be returned in queries unless explicitly asked for
    },
    refreshTokenExpires: Date
},
    { timestamps: true}
);

userSchema.index({ refreshToken: 1 });

userSchema.pre('save', async function(next) {
    if(this.isModified('refreshToken') && this.refreshToken){
        this.refreshToken = await hashRefreshToken(this.refreshToken);
        this.refreshTokenExpires = new Date( Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
    next();
});


export default mongoose.model("User", userSchema);;



import mongoose from "mongoose";


const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '1d' } // Auto-delete when expired
    }
});

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);
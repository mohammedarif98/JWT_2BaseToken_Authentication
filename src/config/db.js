import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
    try{
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error('MongoDB connection URI is not defined in environment variables');

        console.log('Connecting to MongoDB with URI:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    }catch(error){
        console.log('MongoDB connection error:', error.message);
        process.exit(1)
    }
} 

export default connectDB;
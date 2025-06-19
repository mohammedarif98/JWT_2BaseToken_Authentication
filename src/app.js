import express from "express";
import dotenv from "dotenv";
import httpLogger from "./utils/logger.js";
import authRoutes from './routes/auth.route.js'
import connectDB from "./config/db.js";


dotenv.config();

const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpLogger)

app.use('/api/v1/auth',authRoutes);   
 

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    })
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
})
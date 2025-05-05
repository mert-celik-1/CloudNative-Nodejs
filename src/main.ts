import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {config} from 'dotenv';
import {createApiRouter} from './api/routes';
import {RedisService} from './infrastructure/cache/RedisService';
import mongoose from "mongoose";

config();

const app = express();

const redisService = new RedisService();
redisService.connect().catch(err => {
    console.error('Error connecting to Redis:', err);
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
mongoose.connect(mongoUri).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', createApiRouter());

app.get('/health', async (req, res) => {
    const redisStatus = redisService.isConnected ? 'connected' : 'disconnected';
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
        status: 'okay',
        redis: redisStatus,
        mongo: mongoStatus,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

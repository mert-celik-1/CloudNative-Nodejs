import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createApiRouter } from './api/routes';
import { RedisService } from './shared/infrastructure/services';

config();

// Redis servisini başlat
const redisService = new RedisService();
redisService.connect().catch(err => {
  console.error('Error connecting to Redis:', err);
});

// Process kapanırken Redis bağlantısını kapat
process.on('SIGINT', async () => {
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await redisService.disconnect();
  process.exit(0);
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', createApiRouter());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'okay', redis: redisService.isConnected ? 'connected' : 'disconnected' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createApiRouter } from './api/routes';

config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', createApiRouter());


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'okay' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createApiRouter } from './api/routes';
import {errorHandler, notFoundHandler} from "@core/middleware/ErrorHandler";

config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', createApiRouter());


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'okay' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


process.on('uncaughtException', (error: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(error.name, error.message, error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(error.name, error.message, error.stack);
  process.exit(1);
});
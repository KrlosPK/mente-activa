import express from 'express';
import cors from 'cors';
import { sequelize } from './db.js';
import { authRouter } from './routes/auth.js';
import habitsRouter from './routes/habits.js';
import { errorHandler } from './middleware/errorHandler.js';

import './models/index.js';

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/habits', habitsRouter);

app.use(errorHandler);

async function startServer() {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

startServer();

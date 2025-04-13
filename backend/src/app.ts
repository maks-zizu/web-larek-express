import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { errors as celebrateErrors } from 'celebrate';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger, appLogger } from './middlewares/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_ADDRESS = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';

app.use(cors({ origin: process.env.ORIGIN_ALLOW || '*' }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Подключение к MongoDB
mongoose.connect(DB_ADDRESS)
  .then(() => appLogger.info('✅ Успешное подключение к MongoDB'))
  .catch((err) => appLogger.error('❌ Ошибка подключения к MongoDB:', err));

app.get('/', (_req, res) => {
  res.send('Сервер работает!');
});

// логируем все запросы
app.use(requestLogger);

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

// 404 — маршрут не найден
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

// обработка ошибок celebrate
app.use(celebrateErrors());

// логируем все ошибки
app.use(errorLogger);
// централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  appLogger.info(`Сервер запущен на http://localhost:${PORT}`);
});

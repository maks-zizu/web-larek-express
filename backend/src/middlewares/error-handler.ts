import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'На сервере произошла ошибка';

  // Ошибка валидации от Mongoose
  if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Ошибка валидации данных';
  }

  // Ошибка при создании дубликата title
  if (err instanceof Error && err.message.includes('E11000')) {
    statusCode = 409;
    message = 'Товар с таким названием уже существует';
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;

import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

/**
 * Получаем список всех товаров.
 * Возвращаем массив товаров и их количество.
 */
export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Создаем новый товар на основе тела запроса.
 * В случае ошибок валидации или дублирования — пробрасываем соответствующую ошибку.
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      next(new BadRequestError('Товар с таким названием уже существует'));
    } else if (err instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при создании товара'));
    } else {
      next(err);
    }
  }
};

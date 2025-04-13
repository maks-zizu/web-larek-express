import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import validator from 'validator';
import mongoose from 'mongoose';

import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

/**
 * Обрабатываем создание заказа.
 * Проверяем валидность входных данных, существование товаров и совпадение total.
 * Возвращаем id заказа и итоговую сумму при успехе.
 */
const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    payment, email, phone, address, total, items,
  } = req.body;

  try {
    // Валидация основных полей
    if (!['card', 'online'].includes(payment)) {
      throw new BadRequestError('Неверный способ оплаты');
    }

    if (!email || !validator.isEmail(email)) {
      throw new BadRequestError('Некорректный email');
    }

    if (!phone || typeof phone !== 'string') {
      throw new BadRequestError('Некорректный телефон');
    }

    if (!address || typeof address !== 'string') {
      throw new BadRequestError('Некорректный адрес');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError('Список товаров пуст или некорректен');
    }

    // Проверка валидности ObjectId
    const invalidId = items.find((id: string) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
      throw new BadRequestError(`Некорректный ID товара: ${invalidId}`);
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      throw new BadRequestError('Один или несколько товаров не найдены');
    }

    const unavailable = products.find((product) => product.price === null);
    if (unavailable) {
      throw new BadRequestError(`Товар "${unavailable.title}" не продаётся`);
    }

    const calculatedTotal = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError(`Сумма заказа (${total}) не совпадает с расчётом (${calculatedTotal})`);
    }

    // Успешное создание заказа
    res.status(201).json({
      id: faker.string.uuid(),
      total: calculatedTotal,
    });
  } catch (err) {
    next(err);
  }
};

export default createOrder;

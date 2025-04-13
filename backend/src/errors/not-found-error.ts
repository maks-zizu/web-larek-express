/**
 * Кастомный класс ошибки для 404 Not Found.
 * Используем, если не найдено совпадение с маршрутом или сущностью.
 */
class NotFoundError extends Error {
  public statusCode: number;

  constructor(message = 'Маршрут не найден') {
    super(message);
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default NotFoundError;

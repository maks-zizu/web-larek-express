/** Кастомный класс ошибки для 400 Bad Request */
class BadRequestError extends Error {
  // HTTP статус ошибки
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;

    // Устанавливаем имя класса как имя ошибки
    this.name = this.constructor.name;

    // Фиксируем стек вызовов конструктора
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default BadRequestError;

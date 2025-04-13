import { Joi, Segments } from 'celebrate';

const createOrderValidator = {
  [Segments.BODY]: Joi.object({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(
      Joi.string().length(24).hex().required(),
    ).min(1).required(),
  }),
};

export default createOrderValidator;

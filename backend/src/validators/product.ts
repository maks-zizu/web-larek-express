import { Joi, Segments } from 'celebrate';

const createProductValidator = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().allow('', null),
    price: Joi.number().allow(null),
  }),
};

export default createProductValidator;

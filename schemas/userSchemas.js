import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const emailSchema = data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().required().messages({
        'any.required': 'Missing required email field',
      }),
    })
    .validate(data);

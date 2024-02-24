import jwt from 'jsonwebtoken';
import { User } from '../models/userModels.js';
import { HttpError } from '../helpers/HttpError.js';
import dotenv from 'dotenv';
import { catchAsync } from '../helpers/catchAsync.js';
import { emailSchema } from '../schemas/userSchemas.js';
dotenv.config();

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  const [bearer, token] = authorization.split(' ');
  try {
    if (bearer !== 'Bearer') {
      throw HttpError(401);
    }

    if (!token) {
      throw HttpError(401);
    }
    const { id } = jwt.verify(token, SECRET_KEY);

    if (!id) {
      throw HttpError(401);
    }
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw HttpError(401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
export const emailSchemaMid = catchAsync(async (req, res, next) => {
  const { value, error } = emailSchema(req.body);

  // if (error) throw HttpError(401, "Missing required email field");

  req.body = value;

  next();
});

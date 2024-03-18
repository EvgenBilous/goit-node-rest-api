import { HttpError } from '../helpers/HttpError.js';
import { User } from '../models/userModels.js';
import { createUser, emailUnique } from '../services/userServices.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await emailUnique(email);
    if (user) {
      throw HttpError(409, 'Email in use');
    }

    const newUser = await createUser({ ...req.body });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    //find user
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const isPasswordChecked = await bcrypt.compare(password, user.password);

    if (!isPasswordChecked) {
      throw HttpError(401, 'Email or password is wrong');
    }
    //create token
    const payload = {
      id: user._id,
    };
    const tokenIssue = jwt.sign(payload, SECRET_KEY);
    console.log(tokenIssue);
    await User.findByIdAndUpdate(user._id, { token: tokenIssue });

    res.json({
      token: tokenIssue,
      user: {
        email: email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

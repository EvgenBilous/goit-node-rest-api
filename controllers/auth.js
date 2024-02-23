import { HttpError } from '../helpers/HttpError.js';
import { User } from '../models/userModels.js';
import { createUser, emailUnique } from '../services/userServices.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import Jimp from 'jimp';
import fs from 'fs/promises';
const { SECRET_KEY } = process.env;

export const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await emailUnique(email);
    if (user) {
      throw HttpError(409, 'Email in use');
    }

    const newUser = await createUser({ ...req.body });
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
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
      throw HttpError(401);
    }

    const isPasswordChecked = await bcrypt.compare(password, user.password);

    if (!isPasswordChecked) {
      throw HttpError(400);
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

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    //to get file

    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;

    const resultUpload = path.resolve('public/avatars', fileName);
    //to store in the storage
    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(tempUpload);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', fileName);

    //To add to DB
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

import { HttpError } from '../helpers/HttpError.js';
import { User } from '../models/userModels.js';
import { createUser, emailUnique } from '../services/userServices.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import Jimp from 'jimp';
import fs from 'fs/promises';
import { catchAsync } from '../helpers/catchAsync.js';
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
    if (!user.verify) {
      throw HttpError(400, 'User not verified');
    }
    const isPasswordChecked = await bcrypt.compare(password, user.password);

    if (!isPasswordChecked) {
      throw HttpError(400, 'Email or password is wrong');
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
    if (!req.file) {
      throw HttpError(400, 'Avatar is required');
    }
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

export const verificationToken = async (req, res, next) => {
  try {
    //get token
    const { verifyToken } = req.params;

    const user = await User.findOneAndUpdate(
      { verificationToken: verifyToken },
      { verify: true, verificationToken: null }
    );
    if (!user) {
      throw HttpError(404, 'User not found');
    }
    res.json({ message: 'User verified' });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, 'Email not found');

  if (user.verify) throw HttpError(400, 'Verification has already been passed');

  const verifyEmail = {
    to: email,
    subject: 'Verify your email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: 'Verification email sent' });
});

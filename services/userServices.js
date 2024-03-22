import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModels.js';
import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import { sendEmail } from '../helpers/sendEmail.js';

dotenv.config();

const { SECRET_KEY } = process.env;

export const emailUnique = async email => {
  const user = await User.findOne({ email });
  return user;
};

export const createUser = async userData => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const avatarURL = gravatar.url(userData.email);
  const verificationToken = nanoid();

  const user = await User.create({
    ...userData,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });
  await sendEmail(verificationToken);
  //   const newUser = await User.findByIdAndUpdate(
  //     user._id,

  //     { new: true });

  return { email: user.email, subscription: user.subscription };
};

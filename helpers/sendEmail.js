import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import { User } from '../models/userModels.js';
import { catchAsync } from './catchAsync.js';
const { BASE_URL, EMAIL_FROM, EMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  service: 'gmail',
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async tokenVerify => {
  var message = {
    from: '',
    to: 'receiver@sender.com',
    subject: 'Message title',
    text: 'Plaintext version of the message',
    html: `<a href="http://localhost:3000/api/users/verify/${tokenVerify}">Click to verify email</a>`,
  };

  await fs.writeFile(path.resolve('tmp', 'verifyURL'), message.html, 'utf-8');

  // transporter.sendMail(message);
};

export const resendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(BASE_URL);
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

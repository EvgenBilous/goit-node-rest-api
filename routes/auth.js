import validateBody from '../helpers/validateBody.js';
import isValidId from '../helpers/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';
import { loginSchema } from '../schemas/userSchemas.js';
import express from 'express';
import { signupSchema } from '../schemas/userSchemas.js';
import {
  signup,
  login,
  logout,
  current,
  updateAvatar,
  verificationToken,
} from '../controllers/auth.js';
import { authenticate, emailSchemaMid } from '../middleware/authenticate.js';
import { upload } from '../middleware/uploadAvatar.js';
import { resendVerifyEmail } from '../helpers/sendEmail.js';

const userRouter = express.Router();
userRouter.post('/signup', validateBody(signupSchema), signup);
userRouter.post('/login', validateBody(loginSchema), login);

userRouter.post('/logout', authenticate, logout);
userRouter.get('/current', authenticate, current);
userRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  updateAvatar
);
userRouter.get('/verify/:verifyToken', verificationToken);
userRouter.post('/verify', emailSchemaMid, resendVerifyEmail);
export default userRouter;

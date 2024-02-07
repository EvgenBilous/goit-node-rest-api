import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  changeFavorite,
} from '../controllers/contactsControllers.js';
import validateBody from '../helpers/validateBody.js';
import isValidId from '../helpers/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', isValidId, getOneContact);

contactsRouter.delete('/:id', isValidId, deleteContact);

contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  changeContact
);
contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  validateBody(updateFavoriteSchema),
  changeFavorite
);

export default contactsRouter;

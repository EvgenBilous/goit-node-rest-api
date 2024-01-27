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
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put('/:id', validateBody(updateContactSchema), changeContact);
contactsRouter.patch(
  '/:id',
  validateBody(updateFavoriteSchema),
  changeFavorite
);

export default contactsRouter;

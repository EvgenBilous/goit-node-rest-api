import contactsService, { listContacts } from '../services/contactsServices.js';
import contacts from '../db/contacts.json';
import express from 'express';
/**
 * Викликає функцію-сервіс listContacts для роботи з json-файлом contacts.json
Повертає масив всіх контактів в json-форматі зі статусом 200
 * @param {*} req 
 * @param {*} res 
 */
const app = express();
const PORT = process.env.PORT || 3002;

// app.get('/api/contacts', async (req, res) => {
//     fs.readFile('contacts', 'utf-8', async (err, data) => {

//         if(err){
//            return res.status(500).json({message: err.message});
//         }
//         const getContacts = await listContacts();
//           res.status(200).json((getContacts));
//     });
// });
export const getAllContacts = (req, res) => {
  const allContacts = listContacts();
  res.send('Get all contacts');
};

/**
 * @ GET /api/contacts/:id
Викликає функцію-сервіс getContactById для роботи з json-файлом contacts.json
Якщо контакт за id знайдений, повертає об'єкт контакту в json-форматі зі статусом 200
Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404
 * @param {*} req 
 * @param {*} res 
 */
// app.get('/api/contacts:id', (req, res) = {

// })
export const getOneContact = (req, res) => {
  const allContacts = getContactById();
  res.send('Get all contacts');
};

/**
 * @ DELETE /api/contacts/:id
Викликає функцію-сервіс removeContact для роботи з json-файлом contacts.json
Якщо контакт за id знайдений і видалений, повертає об'єкт видаленого контакту в json-форматі зі статусом 200
Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404

 * @param {*} req 
 * @param {*} res 
 */

/**
 * @ POST /api/contacts
Отримує body в json-форматі з полями {name, email, phone}. Усі поля є обов'язковими - для валідації створи у файлі contactsSchemas.js (знаходиться у папці schemas) схему з використаням пакета joi
Якщо в body немає якихось обов'язкових полів (або передані поля мають не валідне значення), повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400
Якщо body валідне, викликає функцію-сервіс addContact для роботи з json-файлом contacts.json, з передачею їй даних з body
За результатом роботи функції повертає новостворений об'єкт з полями {id, name, email, phone} і статусом 201
 * @param {*} req 
 * @param {*} res 
 */

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};

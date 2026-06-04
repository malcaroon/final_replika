import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUserById
} from '../controllers/productControllers.js';
import express from 'express';

const router = express.Router();

router.get('/products', getUsers);
router.post('/products', createUser);
router.get('/products/:id', getUserById);
router.put('/products/:id', updateUser);
router.patch('/products/:id', patchUser);
router.delete('/products/:id', deleteUserById);

export default router;
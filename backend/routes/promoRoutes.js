import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUserById
} from '../controllers/promoController.js';
import express from 'express';

const router = express.Router();

router.get('/promos', getUsers);
router.post('/promos', createUser);
router.get('/promos/:id', getUserById);
router.put('/promos/:id', updateUser);
router.patch('/promos/:id', patchUser);
router.delete('/promos/:id', deleteUserById);

export default router;
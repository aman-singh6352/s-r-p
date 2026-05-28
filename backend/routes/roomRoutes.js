import express from 'express';
import { createRoom, getRooms, getRoomById, saveSessionHistory } from '../controllers/roomController.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Token token failed' });
  }
};

router.route('/').post(protect, createRoom).get(protect, getRooms);
router.route('/:id').get(protect, getRoomById);
router.route('/:id/session').post(protect, saveSessionHistory);

export default router;
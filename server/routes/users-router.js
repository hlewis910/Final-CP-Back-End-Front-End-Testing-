import express from 'express';
import db from '../models';
const User = db.model('user');
const Message = db.model('message');

// This router is already mounted on /users in server/app.js
const router = express.Router();

router.get('/', async(req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.put('/:userId', async(req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    const updated = await user.update(req.body)
    if (updated) {
      res.status(201).json(updated)
    }
  }
catch (error){
  next(error)
}
})

export default router;

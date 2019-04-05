import express from 'express';
import db from '../models';
const Message = db.model('message');
const User = db.model('user');

// This router is already mounted on /messages in server/app.js
const router = express.Router();

router.get('/to/:recipientId', async(req, res, next) => {
  const messages = await Message.findAll({
    where: {
        toId: req.params.recipientId
    }, include: [{model: User, as: 'to'}, {model: User, as: 'from'}]
  })
  res.json(messages)
})


router.get('/from/:senderId', async(req, res, next) => {
  try {
    const messages = await Message.getAllWhereSender( req.params.senderId)
    res.status(200).json(messages)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
  const newMessage = await Message.create(req.body)
  res.status(201).json(newMessage)
  } catch (error) {
    next(error)
  }
})


export default router;

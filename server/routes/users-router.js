import express from 'express';
import db from '../models';
const User = db.model('user');
const Message = db.model('message');

// This router is already mounted on /users in server/app.js
const router = express.Router();

export default router;
import express from 'express';
import db from '../models';
const Message = db.model('message');
const User = db.model('user');

// This router is already mounted on /messages in server/app.js
const router = express.Router();



export default router;

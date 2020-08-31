const express = require('express');
const router = express.Router();
import { getAllMsgs, getMsgById, createMsg, deleteMsg } from '../controllers/messages.controllers';
import verifyAuth from '../middlewares/auth';
import adminAuth from '../middlewares/admin_auth';

// get all messages
router.get('/', verifyAuth, getAllMsgs);

// get specific message by ID
router.get('/:id', verifyAuth, getMsgById);

// create message by ID
router.post('/', createMsg);

// delete message by ID
router.delete('/:id', verifyAuth, deleteMsg);

module.exports = router;

const express = require('express');
const router = express.Router();
import { getAllMsgs, getMsgById, createMsg, deleteMsg } from '../controllers/messages.controllers';
import adminAuth from '../middlewares/admin_auth';

// get all messages
router.get('/', [adminAuth], getAllMsgs);

// get specific message by ID
router.get('/:id', [adminAuth], getMsgById);

// create message by ID
router.post('/', createMsg);

// delete message by ID
router.delete('/:id', [adminAuth], deleteMsg);

module.exports = router;

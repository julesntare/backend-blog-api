const express = require('express');
const router = express.Router();
import { getAllMsgs, getMsgById, createMsg, deleteMsg } from '../controllers/messages.controllers';

// get all messages
router.get('/', getAllMsgs);

// get specific message by ID
router.get('/:id', getMsgById);

// create message by ID
router.post('/', createMsg);

// delete message by ID
router.delete('/:id', deleteMsg);

export default router;

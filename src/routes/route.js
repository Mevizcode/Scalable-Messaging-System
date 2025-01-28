import express from "express";
import { sendMessage, retreiveMessage } from "../controllers/messageController.js";

export const router = express.Router();

router.post('/', sendMessage)
router.get('/', retreiveMessage)
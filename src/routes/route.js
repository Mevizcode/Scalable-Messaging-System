import express from "express";
import { validateSendMessage, validateRetrieveMessages } from '../validations/validateSendMessage.js'
import { validate } from "../middlewares/validate.js";
import { sendMessage, retreiveMessage } from "../controllers/messageController.js";

export const router = express.Router();

router.route('/')
    .post(validateSendMessage, validate, sendMessage)
    .get(validateRetrieveMessages, validate, retreiveMessage);
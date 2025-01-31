import { saveMessage, fetchMessages } from "../services/messageService.js";
import { ERROR_MESSAGES } from "../utils/errorMessages.js";

export const sendMessage = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: ERROR_MESSAGES.ERROR_400 });
    }

    try {
        const message = await saveMessage(req.body);
        return res.status(201).json({ message });
    } catch (error) {
        console.error('Error while saving message: ', error);
        return res.status(500).json({ error: ERROR_MESSAGES.ERROR_500 });
    }
}

export const retreiveMessage = async (req, res) => {
    if (!req.body || Object.keys(req.query).length === 0) {
        return res.status(400).json({ error: ERROR_MESSAGES.ERROR_400 });
    }

    try {
        const messages = await fetchMessages(req.query);
        return res.status(200).json({ messages });
    } catch (err) {
        console.error('Error while retrieving messages: ', err);
        return res.status(500).json({ error: ERROR_MESSAGES.ERROR_500 });
    }
}
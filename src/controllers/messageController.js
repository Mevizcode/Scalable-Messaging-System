import { saveMessage, fetchMessages } from "../services/messageService.js";

export const sendMessage = async (req, res) => {
    try {
        const message = await saveMessage(req.body);
        if (message.length > 0) {
           return res.status(201).send(message);
        }
       return res.status(400).send();
    } catch (error) {
        return res.status(500).json({ errorMessage: error });
    }
}

export const retreiveMessage = async (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const groupId = req.params.groupId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const isValidDate = (date) => !isNaN(Date.parse(date));

    if (startDate && !isValidDate(startDate)) {
        return res.status(400).json({ errorMessage: 'Invalid startDate format' });
    }

    if (endDate && !isValidDate(endDate)) {
        return res.status(400).json({ errorMessage: 'Invalid endDate format' });
    }

    try {
        const messages = await fetchMessages(senderId, receiverId, groupId, startDate, endDate, pageSize, offset);

        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found' });
        }

        res.status(200).json(messages);
    } catch (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).json({ errorMessage: err.message });
    }
}
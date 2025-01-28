import { saveMessage, fetchMessages } from "../services/messageService.js";

export const sendMessage = async (req, res) => {
    try {
        const message = await saveMessage(req.body);
        return res.status(201).send(message);
    } catch (error) {
        return res.status(500).json({ errorMessage: error });
    }
}

export const retreiveMessage = async (req, res) => {
    const { senderId, receiverId, groupId, startDate, endDate, page, pageSize } = req.query;

    const isValidDate = (date) => !isNaN(Date.parse(date));

    if (startDate && !isValidDate(startDate)) {
        return res.status(400).json({ errorMessage: 'Invalid startDate format' });
    }

    if (endDate && !isValidDate(endDate)) {
        return res.status(400).json({ errorMessage: 'Invalid endDate format' });
    }

    try {
        const messages = await fetchMessages(senderId, receiverId, groupId, startDate, endDate, parseInt(pageSize), parseInt(page));

        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found' });
        }

        res.status(200).json(messages);
    } catch (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).json({ errorMessage: err.message });
    }
}
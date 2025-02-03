import { savedMessage, getMessages } from '../data/db.messages.js';
import { addMessageStatus, modifyMessageStatus } from "./messageStatusService.js";
import { privateMessage, groupMessage } from '../utils/emitMessage.js';
import { validateDate } from "../validations/validateDate.js";
import { MESSAGE_STATUS } from '../utils/messageStatus.js';
import { getCache, setCache } from '../config/redis.js';

export const saveMessage = async ({ senderId, receiverId, groupId, content }) => {
    try {
        const [message] = await savedMessage({ senderId, receiverId, groupId, content });
        const { message_id: messageId, timestamp } = message;

        await addMessageStatus({ messageId, status: MESSAGE_STATUS.SENT });

        if (receiverId && senderId) {
            await privateMessage({ senderId, receiverId, content, timestamp });
        } else if (groupId) {
            await groupMessage({ senderId, groupId, content, timestamp });
        }
        return await modifyMessageStatus({ messageId, status: MESSAGE_STATUS.DELIVERED });
    } catch (err) {
        throw err;
    }
}

export const fetchMessages = async ({ senderId, receiverId, groupId, startDate, endDate, page = 1, pageSize = 20 }) => {
    try {
        if (startDate) validateDate(startDate, 'startDate');
        if (endDate) validateDate(endDate, 'endDate');

        const cacheKey = `messages:${senderId || 'null'}:${receiverId || 'null'}:${groupId || 'null'}:${startDate || 'null'}:${endDate || 'null'}:page${page}:size${pageSize}`;
        const cachedMessages = await getCache(cacheKey);
        if (cachedMessages) {
            console.log('Cached Message: ', cachedMessages);
            return JSON.parse(cachedMessages);
        }

        const messages = await getMessages({ senderId, receiverId, groupId, startDate, endDate, page, pageSize });
        if (!messages.length) return messages;

        const messageIds = messages.map(({ message_id }) => message_id);
        await modifyMessageStatus({ messageIds, status: MESSAGE_STATUS.READ });

        //cache the result for 5mins
        await setCache(cacheKey, 500, JSON.stringify(messages));

        return messages;
    } catch (err) {
        throw err;
    }
}
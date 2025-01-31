import { saveMessageStatus, updateMessageStatus } from '../data/db.message-status.js';
import { validateMessageId } from '../validations/validateMessageId.js';

export const addMessageStatus = async ({ messageId, status }) => {
    try {
        validateMessageId(messageId);
        return await saveMessageStatus({ messageId, status });
    } catch (err) {
        throw err;
    }
};

export const modifyMessageStatus = async ({ messageId, status }) => {
    try {
        return await updateMessageStatus({ messageId, status });
    } catch (err) {
        throw err;
    }
};



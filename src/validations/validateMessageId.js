import { ERROR_MESSAGES } from '../utils/errorMessages.js';
export const validateMessageId = (messageId) => {
    if (!Number(messageId) || messageId === 0) {
        throw new Error(ERROR_MESSAGES.INVALID_MESSAGE_ID);
    }
};
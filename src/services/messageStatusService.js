import { queryDb } from '../config/db.js';

export const addMessageStatus = async (messageId) => {
    const STATUS = 'sent';
    if (!messageId) {
        throw new Error('Invalid message Id');
    }

    const query = 'INSERT INTO messages_status (status, message_id) VALUES ($1, $2) RETURNING *';
    const value = [STATUS, messageId];

    try {
        const savedMessageStatus = await queryDb(query, value);
        if (savedMessageStatus[0].length <= 0) {
            throw new Error('Failed to add message status');
        }

        console.log(savedMessageStatus[0]);
        // Cache the result to reduce DB hits
        await cacheSet(`message_status:${savedStatus.id}`, JSON.stringify(savedStatus));

        return savedMessageStatus[0];
    } catch (err) {
        console.error('Could not insert message status: ' + err.message);
        throw new Error('Error inserting message status');
    }
};

export const updateMessageStatus = async (messageId, status) => {
    const validStatuses = ['sent', 'deleivered', 'read'];
    if (!validStatuses.includes(status)) throw new Error('Invalid message status');

    if (!messageId) throw new Error('Invalid messageId');

    // Check if status is already cached
    const cachedStatus = await cacheGet(`message_status:${messageId}`);
    if (cachedStatus) {
        const messageStatus = JSON.parse(cachedStatus);
        if (messageStatus.status === status) {
            console.log('Message status is already up-to-date');
            return messageStatus;  // Return cached status if it matches
        }
    }

    const query = 'UPDATE message_status SET status = $1 WHERE message_id = $2 RETURNING *;';
    const values = [status, messageId];

    try {
        const updatedMessageStatus = await queryDb(query, values);
        if (updatedMessageStatus <= 0) {
            throw new Error(`Message status not updated`);
        }

        // Cache the updated status to reduce future DB queries
        await cacheSet(`message_status:${messageId}`, JSON.stringify(updatedStatus));

        return updatedMessageStatus;
    } catch (err) {
        console.error('Could not insert message status: ' + err.message);
        throw new Error('Error inserting message status');
    }
};
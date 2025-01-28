import { queryDb } from '../config/db.js';
//import { setCache, getCache } from '../config/redis.js';

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

        // Cache the result to reduce DB hits
        //await cacheSet(`message_status:${savedStatus.id}`, JSON.stringify(savedStatus));

        return savedMessageStatus[0];
    } catch (err) {
        console.error('Could not insert message status: ' + err.message);
        throw new Error('Error inserting message status');
    }
};

export const updateMessageStatus = async (messageId, status) => {
    console.log('Updating message status for messageId: ' + messageId, status);
    const validStatuses = ['sent', 'delivered', 'read'];
    if (!validStatuses.includes(status)) throw new Error('Invalid message status');

    if (!messageId) throw new Error('Invalid messageId');

    // Check if status is already cached
    //const cachedStatus = await cacheGet(`message_status:${messageId}`);
    // if (cachedStatus) {
    //     const messageStatus = JSON.parse(cachedStatus);
    //     if (messageStatus.status === status) {
    //         console.log('Message status is already up-to-date');
    //         return messageStatus;  // Return cached status if it matches
    //     }
    // }

    const query = 'UPDATE messages_status SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE message_id = $2 RETURNING *;';
    const values = [status, messageId];

    try {
        const updatedMessageStatus = await queryDb(query, values);

        // Cache the updated status to reduce future DB queries
        //await cacheSet(`message_status:${messageId}`, JSON.stringify(updatedStatus));
        console.log('newly updated message status = ', updatedMessageStatus);
        return updatedMessageStatus;
    } catch (err) {
        console.error('Could not insert message status: ' + err.message);
        throw new Error('Error inserting message status');
    }
};
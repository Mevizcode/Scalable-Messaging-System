import { queryDb } from "../config/db.js";
import socketIOConfig from '../config/socketIO.js';
import { addMessageStatus, updateMessageStatus } from "./messageStatusService.js";
//import { getCache, setCache } from '../config/redis.js';

export const saveMessage = async (messages) => {
    const { senderId, receiverId, groupId, content } = messages;

    if (!senderId || !(!receiverId || !groupId) || !content) {
        throw new Error('Invalid inputs');
    }

    //save messages to db
    const query = groupId
        ? 'INSERT INTO messages (sender_id, group_id, content) VALUES($1, $2, $3) RETURNING *'
        : 'INSERT INTO messages (sender_id, receiver_id, content) VALUES($1, $2, $3) RETURNING *';

    const values = groupId
        ? [senderId, groupId, content]
        : [senderId, receiverId, content];

    try {
        const result = await queryDb(query, values);

        const savedMessages = result[0];

        console.log(savedMessages)
        console.log(savedMessages.message_id)
        const messageId = savedMessages.message_id;

        //notify via socket.IO
        const io = socketIOConfig.getSocketInstance();
        if (receiverId) {
            io.to(receiverId).emit('join_conversation', ({ senderId, receiverId }));
            io.to(`conversation_${senderId}_${receiverId}`).emit('new_message', content);
            io.to(`conversation_${receiverId}_${senderId}`).emit('new_message', content); // Also notify the other user in the conversation
            console.log(`Message sent to conversation_${senderId}_${receiverId}`, content);
            addMessageStatus(messageId)
        } else if (groupId) {
            io.to(`group_${groupId}`).emit('join_group', ({ groupId }));
            io.to(`group_${groupId}`).emit('new_message', content);
            console.log(`Message sent to group_${groupId}`);
            addMessageStatus(messageId)
        }

        return savedMessages;
    } catch (err) {
        console.error('Error while adding messages to db: ', err);
        throw new Error('Error while saving the message');
    }
}

export const fetchMessages = async (senderId, receiverId, groupId, startDate, endDate, page = 0, pageSize = 20) => {
    if (!senderId || !(receiverId || groupId)) {
        throw new Error('Invalid Id');
    }

    try {
        const cachekey = receiverId
            ? `conversation:${senderId}:${receiverId}`
            : `conversation:group:${groupId}`;
        // 1. Check Redis cache
        const cachedMessages = await getCache(cachekey);
        let messages = cachedMessages ? JSON.parse(cachedMessages) : [];

        // 2. Build database query if cache is empty
        if (!messages.length) {
            let query = groupId
                ? 'SELECT * FROM messages WHERE group_id = $1'
                : 'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)';

            const values = groupId ? [groupId] : [senderId, receiverId];

            if (startDate) {
                query += ' AND timestamp >= $3';
                values.push(startDate);
            }

            if (endDate) {
                query += ' AND timestamp <= $4';
                values.push(endDate);
            }

            query += ' ORDER BY timestamp DESC LIMIT $5 OFFSET $6';
            values.push(pageSize, page)

            const result = await queryDb(query, values);
            messages = result;

            //loop throw all the messages and update message status accordingly
            // Cache the result for future requests
            //await setCache(cachekey, 500, JSON.stringify(messages));
        }
        return messages;
    } catch (err) {
        console.error('Error while retrieving messages: ', err);
        throw new Error('Error while retrieving messages');
    }
}
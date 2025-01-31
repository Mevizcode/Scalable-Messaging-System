import { pool } from "../config/db.js";

const INSERT_MESSAGE_STATUS_QUERY = 'INSERT INTO messages_status (message_id, status) VALUES ($1, $2) RETURNING *';
const UPDATE_MESSAGE_STATUS_QUERY = 'UPDATE messages_status SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE message_id = $2 RETURNING message_id, status, updated_at';

export const saveMessageStatus = async ({ messageId, status }) => {
    try {
        return (await pool.query(INSERT_MESSAGE_STATUS_QUERY, [messageId, status])).rows;
    } catch (err) {
        throw err;
    }
};

export const updateMessageStatus = async ({ messageId, status }) => {
    try {
        return (await pool.query(UPDATE_MESSAGE_STATUS_QUERY, [status, messageId])).rows;
    } catch (err) {
        throw err;
    }
};
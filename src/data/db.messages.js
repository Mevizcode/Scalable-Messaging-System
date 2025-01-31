import { pool } from "../config/db.js";

const INSERT_MESSAGE_QUERY = 'INSERT INTO messages (sender_id, receiver_id, group_id, content) VALUES($1, $2, $3, $4) RETURNING *';

export const savedMessage = async ({
    senderId,
    receiverId,
    groupId,
    content }) => {
    try {
        const values = [senderId, receiverId || null, groupId || null, content];
        return (await pool.query(INSERT_MESSAGE_QUERY, values)).rows;
    } catch (err) {
        throw err;
    }
};

export const getMessages = async ({ senderId,
    receiverId,
    groupId,
    startDate,
    endDate,
    page,
    pageSize
}) => {
    const queryParams = {
        text: [],
        values: [],
        paramCount: 1
    };

    try {
        if (groupId) {
            queryParams.text.push(`SELECT * FROM messages WHERE group_id = $${queryParams.paramCount}`);
            queryParams.values.push(parseInt(groupId));
            queryParams.paramCount++;
        } else if (receiverId) {
            queryParams.text.push(`
                  SELECT * FROM messages 
                  WHERE (sender_id = $${queryParams.paramCount} AND receiver_id = $${queryParams.paramCount + 1})
                  OR (sender_id = $${queryParams.paramCount + 1} AND receiver_id = $${queryParams.paramCount})
              `);
            queryParams.values.push(parseInt(senderId), parseInt(receiverId));
            queryParams.paramCount += 2;
        } else if (senderId) {
            queryParams.text.push(`SELECT * FROM messages WHERE sender_id = $${queryParams.paramCount}`);
            queryParams.values.push(parseInt(senderId));
            queryParams.paramCount++;
        }

        // Date filtering
        if (startDate) {
            queryParams.text.push(`AND timestamp::date >= $${queryParams.paramCount}`);
            queryParams.values.push(new Date(startDate).toISOString());
            queryParams.paramCount++;
        }

        if (endDate) {
            queryParams.text.push(`AND timestamp::date <= $${queryParams.paramCount}`);
            queryParams.values.push(new Date(endDate).toISOString());
            queryParams.paramCount++;
        }

        //paginate 
        queryParams.text.push(`
              ORDER BY timestamp DESC
              LIMIT $${queryParams.paramCount}
              OFFSET $${queryParams.paramCount + 1}
          `);
        queryParams.values.push(parseInt(pageSize), (page - 1) * pageSize);

        const finalQuery = {
            text: queryParams.text.join(' '),
            values: queryParams.values
        };
        return (await pool.query(finalQuery.text, finalQuery.values)).rows;
    } catch (err) {
        throw err;
    }
};
import { queryDb } from '../config/db.js';

export const createUser = async (user) => {
    const { name } = user;

    if (!name || name === '')
        throw new Error('name is required');

    const query = 'INSERT INTO users (username) VALUES ( $1 ) RETURNING *;'
    const value = [name];

    try {
        const result = await queryDb(query, value);

        return result[0];
    } catch (err) {
        console.error('Error creating user: ' + err.message);
        throw new Error('Error creating user');
    }
}
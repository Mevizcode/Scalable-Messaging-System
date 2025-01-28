import { queryDb } from '../config/db.js';

export const createGroup = async (group) => {

    const { name } = group;
    if (!name || name == '') {
        throw new Error('Group name is required');
    }

    const query = 'INSERT INTO groups (group_name) VALUES ($1) RETURNING *';
    const value = [name];

    try {
        const result = await queryDb(query, value);
        return result[0];
    } catch (err) {
        console.error('Error while creating group', err);
        throw new Error('Unable to create group');
    }
};
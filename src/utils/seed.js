import { createUser } from '../services/userService.js';
import { createGroup } from '../services/groupService.js';
import { users, groups } from '../utils/data.js';

export const seedData = async () => {
    try {
        for (const user of users) {
            await createUser(user);
        }

        for (const group of groups) {
            await createGroup(group);
        }
        console.log('Users and Groups have been seeded!');
    } catch (err) {
        console.error('Error seeding data:', err);
        throw err;
    }
};

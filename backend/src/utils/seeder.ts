import Role from '../models/Role.js';
import { seedAdminUser } from './userSeeder.js';

export const seedDatabase = async () => {
    try {
        const rolesCount = await Role.count();
        if (rolesCount === 0) {
            await Role.bulkCreate([
                { name: 'Admin' },
                { name: 'Provider' },
                { name: 'User' },
            ]);
            console.log('✅ Default roles seeded.');
        }

        // Seed admin user
        await seedAdminUser();

    } catch (error) {
        console.error('❌ Error seeding roles:', error);
    }
};

import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const seedAdminUser = async () => {
    try {
        const adminRole = await Role.findOne({ where: { name: 'Admin' } });
        if (!adminRole) {
            console.error('❌ Admin role not found. Please seed roles first.');
            return;
        }

        const adminEmail = 'admin@spark.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            // Update password just in case it's null or wrong
            const password_hash = await bcrypt.hash('admin123', 10);
            await existingAdmin.update({ password_hash });
            console.log('✅ Admin user already exists, password reset to admin123.');
            return;
        }

        const password_hash = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin User',
            email: adminEmail,
            password_hash,
            role_id: adminRole.id,
        });

        console.log('✅ Admin user seeded successfully.');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};

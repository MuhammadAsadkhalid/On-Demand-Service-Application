import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Service from './Service.js';

class Booking extends Model {
    declare public id: number;
    declare public user_id: number;
    declare public provider_id?: number;
    declare public service_id: number;
    declare public status: string;
    declare public booking_date: string;
    declare public booking_time: string;
    declare public total_price: number;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        provider_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Service,
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Completed'),
            defaultValue: 'Pending',
        },
        booking_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        booking_time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'bookings',
    }
);

Booking.belongsTo(User, { as: 'Customer', foreignKey: 'user_id', onDelete: 'CASCADE' });
Booking.belongsTo(User, { as: 'Provider', foreignKey: 'provider_id', onDelete: 'CASCADE' });
Booking.belongsTo(Service, { foreignKey: 'service_id', onDelete: 'CASCADE' });

export default Booking;

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Role extends Model {
    declare public id: number;
    declare public name: string;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.ENUM('Admin', 'Provider', 'User'),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: false,
    }
);

export default Role;

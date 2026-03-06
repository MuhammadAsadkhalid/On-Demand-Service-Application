import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Notification extends Model {
    declare id: number;
    declare user_id: number;
    declare title: string;
    declare message: string;
    declare is_read: boolean;
}

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'Notification',
});

export default Notification;

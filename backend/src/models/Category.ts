import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Category extends Model {
    declare public id: number;
    declare public name: string;
    declare public description?: string;
    declare public icon_url?: string;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        icon_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'categories',
    }
);

export default Category;

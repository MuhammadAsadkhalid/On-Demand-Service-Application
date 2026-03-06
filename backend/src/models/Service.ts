import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';

class Service extends Model {
    declare public id: number;
    declare public category_id: number;
    declare public name: string;
    declare public description?: string;
    declare public price: number;
    declare public is_active: boolean;
}

Service.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'services',
    }
);

Service.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Service, { foreignKey: 'category_id' });

export default Service;

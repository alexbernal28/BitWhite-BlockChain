import { DataTypes, Model } from 'sequelize';
import sequelize from '../../persistence/database.js';

class Role extends Model {}

Role.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  schema: 'auth',
  timestamps: true
});

export default Role;

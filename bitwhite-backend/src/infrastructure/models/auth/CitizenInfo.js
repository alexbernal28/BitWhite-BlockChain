import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const CitizenInfo = sequelize.define('CitizenInfo', {
  id:     { type: DataTypes.INTEGER(), primaryKey: true },
  cedula: {type: DataTypes.STRING(12), allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: {
      name: 'uq_citizen_infos_user_id', 
    },
    references: {
      model: { tableName: 'users', schema: 'auth' },
      key: 'id',
    },
    onUpdate: 'CASCADE',
  },
  phone:{ type: DataTypes.STRING(20)},
}, {
  schema: 'auth',
  tableName: 'citizen_infos',
  timestamps: true
});
export default CitizenInfo;
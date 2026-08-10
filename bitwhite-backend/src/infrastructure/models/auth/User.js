import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const User = sequelize.define('User', {
  id:     { type: DataTypes.INTEGER(), primaryKey: true, autoIncrement: true },
  name:   { type: DataTypes.STRING(40), allowNull: false },
  email:  { type: DataTypes.STRING(90), allowNull: false,  
            unique: {
          name: 'uq_users_email'
    } },
  password: { type: DataTypes.STRING(64), allowNull: false },
  rolId:    { type: DataTypes.SMALLINT(), allowNull: false, 
            references:{model:{ tableName: 'roles', schema: 'auth' },
                        key: 'id'} },
}, {
  schema: 'auth',
  tableName: 'users',
  timestamps: true
});
export default User;

import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const Role = sequelize.define('Role', {
  id:       { type: DataTypes.SMALLINT(), autoIncrement: true, primaryKey: true },
  name:      { type: DataTypes.ENUM('ciudadano', 'empresa', 'gobierno','administrador'), allowNull: false, 
            unique: true },
  description: {type: DataTypes.STRING(150), allowNull: true}
}, {
  schema: 'auth',
  tableName: 'roles',
  timestamps: true
});

<<<<<<< Updated upstream
export default Role;
=======
export default Role;
>>>>>>> Stashed changes

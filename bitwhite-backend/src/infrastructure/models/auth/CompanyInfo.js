import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const CompanyInfo = sequelize.define('CompanyInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: {
      name: 'uq_company_infos_user_id', 
    },
    references: {
      model: { tableName: 'users', schema: 'auth' },
      key: 'id',
    },
    onUpdate: 'CASCADE',
  },
  companyName: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  rnc: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      name: 'uq_company_infos_rnc',
    },
  },
  razon_social:{type: DataTypes.STRING(64), allowNull: false},
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sector_economico:{type: DataTypes.STRING(40), allowNull: false},
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  cargo_empresa: {type: DataTypes.STRING(25), allowNull: false},
  provincia:{type:DataTypes.STRING(30), allowNull: false},
}, {
  schema: 'auth', // o 'company'
  tableName: 'company_infos',
  timestamps: true,
});

<<<<<<< Updated upstream
export default CompanyInfo;
=======
export default CompanyInfo;
>>>>>>> Stashed changes

import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const Tender = sequelize.define('Tender', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  processNumber: { type: DataTypes.STRING(40), allowNull: false, unique: { name: 'uq_tenders_process_number' } },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: {
    type: DataTypes.ENUM('Bienes', 'Servicios', 'Obras', 'Consultoría'),
    allowNull: false,
  },
  budget: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  publicationDate: { type: DataTypes.DATEONLY, allowNull: false },
  deadline: { type: DataTypes.DATEONLY, allowNull: false },
  requirements: { type: DataTypes.TEXT, allowNull: true },
  documentPath: { type: DataTypes.STRING(255), allowNull: true },
  documentHash: { type: DataTypes.STRING(64), allowNull: true },
  status: {
    type: DataTypes.ENUM('Publicada', 'En evaluación', 'Adjudicada', 'Cancelada'),
    allowNull: false,
    defaultValue: 'Publicada',
  },
  createdByUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: { tableName: 'users', schema: 'auth' }, key: 'id' },
  },
  awardedCompanyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: { tableName: 'company_infos', schema: 'auth' }, key: 'id' },
  },
}, {
  schema: 'procurement',
  tableName: 'tenders',
  timestamps: true,
});

export default Tender;

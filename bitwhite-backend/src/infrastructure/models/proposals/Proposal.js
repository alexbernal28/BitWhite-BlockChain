import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const Proposal = sequelize.define('Proposal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: { tableName: 'tenders', schema: 'procurement' }, key: 'id' },
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: { tableName: 'company_infos', schema: 'auth' }, key: 'id' },
  },
  offeredAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('Enviada', 'En revisión', 'Aprobada', 'Rechazada'),
    allowNull: false,
    defaultValue: 'Enviada',
  },
}, {
  schema: 'proposals',
  tableName: 'proposals',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['tenderId', 'companyId'], name: 'uq_proposals_tender_company' },
  ],
});

export default Proposal;

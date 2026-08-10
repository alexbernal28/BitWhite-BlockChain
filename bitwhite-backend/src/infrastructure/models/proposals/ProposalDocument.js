import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const ProposalDocument = sequelize.define('ProposalDocument', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  proposalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: { tableName: 'proposals', schema: 'proposals' }, key: 'id' },
  },
  documentName: { type: DataTypes.STRING(150), allowNull: false },
  filePath: { type: DataTypes.STRING(255), allowNull: false },
  documentHash: { type: DataTypes.STRING(64), allowNull: false },
}, {
  schema: 'proposals',
  tableName: 'proposal_documents',
  timestamps: true,
});

export default ProposalDocument;

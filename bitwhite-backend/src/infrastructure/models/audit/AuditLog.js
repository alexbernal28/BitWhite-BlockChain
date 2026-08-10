import { DataTypes } from 'sequelize';
import sequelize from '../../persistence/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: { tableName: 'users', schema: 'auth' }, key: 'id' },
  },
  actionType: { type: DataTypes.STRING(50), allowNull: false },
  entityType: { type: DataTypes.STRING(50), allowNull: true },
  entityId: { type: DataTypes.INTEGER, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
}, {
  schema: 'audit',
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false,
});

export default AuditLog;

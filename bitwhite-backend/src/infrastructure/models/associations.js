// Punto único donde se registran los modelos y sus relaciones (asociaciones
// Sequelize). Debe importarse antes de usar sequelize.sync() para que las
// claves foráneas y los alias queden definidos.

import User from './auth/User.js';
import Role from './auth/Role.js';
import CitizenInfo from './auth/CitizenInfo.js';
import CompanyInfo from './auth/CompanyInfo.js';
import Tender from './procurement/Tender.js';
import Proposal from './proposals/Proposal.js';
import ProposalDocument from './proposals/ProposalDocument.js';
import AuditLog from './audit/AuditLog.js';

Role.hasMany(User, { foreignKey: 'rolId' });
User.belongsTo(Role, { foreignKey: 'rolId', as: 'role' });

User.hasOne(CitizenInfo, { foreignKey: 'userId', as: 'citizenInfo' });
CitizenInfo.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(CompanyInfo, { foreignKey: 'userId', as: 'companyInfo' });
CompanyInfo.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Tender, { foreignKey: 'createdByUserId', as: 'tendersCreated' });
Tender.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });

CompanyInfo.hasMany(Tender, { foreignKey: 'awardedCompanyId', as: 'tendersWon' });
Tender.belongsTo(CompanyInfo, { foreignKey: 'awardedCompanyId', as: 'awardedCompany' });

Tender.hasMany(Proposal, { foreignKey: 'tenderId', as: 'proposals' });
Proposal.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });

CompanyInfo.hasMany(Proposal, { foreignKey: 'companyId', as: 'proposals' });
Proposal.belongsTo(CompanyInfo, { foreignKey: 'companyId', as: 'company' });

Proposal.hasMany(ProposalDocument, { foreignKey: 'proposalId', as: 'documents' });
ProposalDocument.belongsTo(Proposal, { foreignKey: 'proposalId', as: 'proposal' });

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

export { User, Role, CitizenInfo, CompanyInfo, Tender, Proposal, ProposalDocument, AuditLog };

import fs from 'fs';
import { Proposal, ProposalDocument, Tender, CompanyInfo, AuditLog } from '../infrastructure/models/associations.js';
import { sha256Buffer } from '../services/hash.service.js';
import { HttpError } from '../services/auth.service.js';
import sequelize from '../infrastructure/persistence/database.js';

export async function submitProposal(req, res, next) {
  try {
    const { tenderId, offeredAmount, message } = req.body;
    if (!tenderId) throw new HttpError(400, 'Debes indicar la licitación a la que aplicas.');
    if (!req.file) throw new HttpError(400, 'El documento de la propuesta (PDF) es obligatorio.');

    const tender = await Tender.findByPk(tenderId);
    if (!tender) throw new HttpError(404, 'Licitación no encontrada.');
    if (tender.status !== 'Publicada') {
      throw new HttpError(400, 'Esta licitación ya no admite nuevas propuestas.');
    }

    const company = await CompanyInfo.findOne({ where: { userId: req.user.id } });
    if (!company) throw new HttpError(403, 'Tu cuenta no tiene un perfil de empresa asociado.');

    const existing = await Proposal.findOne({ where: { tenderId, companyId: company.id } });
    if (existing) throw new HttpError(400, 'Tu empresa ya envió una propuesta para esta licitación.');

    const fileBuffer = fs.readFileSync(req.file.path);
    const documentHash = sha256Buffer(fileBuffer);

    const result = await sequelize.transaction(async (t) => {
      const proposal = await Proposal.create(
        { tenderId, companyId: company.id, offeredAmount: offeredAmount || null, message: message || null },
        { transaction: t }
      );
      const document = await ProposalDocument.create(
        {
          proposalId: proposal.id,
          documentName: req.file.originalname,
          filePath: req.file.filename,
          documentHash,
        },
        { transaction: t }
      );
      return { proposal, document };
    });

    await AuditLog.create({
      userId: req.user.id,
      actionType: 'PROPUESTA_ENVIADA',
      entityType: 'Proposal',
      entityId: result.proposal.id,
      description: `Propuesta de la empresa "${company.companyName}" para la licitación #${tenderId}, hash ${documentHash}.`,
    });

    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

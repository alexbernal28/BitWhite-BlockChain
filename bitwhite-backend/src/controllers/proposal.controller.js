import fs from 'fs';
import { Proposal, ProposalDocument, Tender, CompanyInfo, AuditLog } from '../infrastructure/models/associations.js';
import { sha256Buffer } from '../services/hash.service.js';
import { HttpError } from '../services/auth.service.js';
import sequelize from '../infrastructure/persistence/database.js';

const PROPOSAL_DETAIL_INCLUDES = [
  { model: Tender, as: 'tender' },
  // Incluye userId: assertCanViewProposal lo necesita para autorizar a la
  // empresa dueña de la propuesta (no se expone en los listados públicos).
  { model: CompanyInfo, as: 'company', attributes: ['id', 'userId', 'companyName', 'rnc', 'razon_social'] },
  { model: ProposalDocument, as: 'documents' },
];

/**
 * Verifica que el usuario autenticado tenga derecho a ver el detalle de una
 * propuesta: la empresa que la envió, o el gobierno dueño de la licitación
 * a la que pertenece.
 */
function assertCanViewProposal(proposal, user) {
  if (user.role === 'gobierno' && proposal.tender?.createdByUserId === user.id) return;
  if (user.role === 'empresa' && proposal.company?.userId === user.id) return;
  throw new HttpError(403, 'No tienes permiso para ver esta propuesta.');
}

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

/**
 * Propuestas enviadas por la empresa autenticada ("Mis propuestas").
 */
export async function listMyProposals(req, res, next) {
  try {
    const company = await CompanyInfo.findOne({ where: { userId: req.user.id } });
    if (!company) throw new HttpError(403, 'Tu cuenta no tiene un perfil de empresa asociado.');

    const proposals = await Proposal.findAll({
      where: { companyId: company.id },
      include: [
        { model: Tender, as: 'tender', attributes: ['id', 'title', 'processNumber', 'status', 'deadline'] },
        { model: ProposalDocument, as: 'documents' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ status: 'success', data: proposals });
  } catch (err) {
    next(err);
  }
}

/**
 * Propuestas recibidas por una licitación específica. Solo la entidad de
 * gobierno que la publicó puede consultarlas.
 */
export async function listProposalsForTender(req, res, next) {
  try {
    const tender = await Tender.findByPk(req.params.tenderId);
    if (!tender) throw new HttpError(404, 'Licitación no encontrada.');
    if (tender.createdByUserId !== req.user.id) {
      throw new HttpError(403, 'No tienes permiso para ver las propuestas de esta licitación.');
    }

    const proposals = await Proposal.findAll({
      where: { tenderId: tender.id },
      include: [
        { model: CompanyInfo, as: 'company', attributes: ['id', 'companyName', 'rnc', 'razon_social'] },
        { model: ProposalDocument, as: 'documents' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ status: 'success', data: proposals });
  } catch (err) {
    next(err);
  }
}

/**
 * Detalle completo de una propuesta. Accesible para la empresa que la
 * envió y para el gobierno dueño de la licitación asociada.
 */
export async function getProposal(req, res, next) {
  try {
    const proposal = await Proposal.findByPk(req.params.id, { include: PROPOSAL_DETAIL_INCLUDES });
    if (!proposal) throw new HttpError(404, 'Propuesta no encontrada.');

    assertCanViewProposal(proposal, req.user);

    res.status(200).json({ status: 'success', data: proposal });
  } catch (err) {
    next(err);
  }
}

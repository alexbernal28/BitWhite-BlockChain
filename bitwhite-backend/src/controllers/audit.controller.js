import { Tender, ProposalDocument, Proposal, CompanyInfo, AuditLog } from '../infrastructure/models/associations.js';
import { HttpError } from '../services/auth.service.js';

/**
 * Verifica si un hash SHA-256 corresponde a un documento registrado en el
 * sistema (pliego de una licitación o propuesta de una empresa). No requiere
 * autenticación: es el mecanismo público de auditoría ciudadana.
 */
export async function verifyHash(req, res, next) {
  try {
    const hash = (req.body.hash || '').trim().toLowerCase();
    if (!hash) throw new HttpError(400, 'Debes indicar el hash a verificar.');

    const tender = await Tender.findOne({ where: { documentHash: hash } });
    if (tender) {
      await AuditLog.create({
        actionType: 'VERIFICACION_CIUDADANA',
        entityType: 'Tender',
        entityId: tender.id,
        description: `Hash ${hash} verificado como auténtico contra la licitación "${tender.title}".`,
      });
      return res.status(200).json({
        status: 'success',
        data: { match: true, type: 'tender', reference: tender },
      });
    }

    const proposalDocument = await ProposalDocument.findOne({
      where: { documentHash: hash },
      include: [{ model: Proposal, as: 'proposal', include: [{ model: CompanyInfo, as: 'company', attributes: ['id', 'companyName'] }] }],
    });
    if (proposalDocument) {
      await AuditLog.create({
        actionType: 'VERIFICACION_CIUDADANA',
        entityType: 'ProposalDocument',
        entityId: proposalDocument.id,
        description: `Hash ${hash} verificado como auténtico contra una propuesta.`,
      });
      return res.status(200).json({
        status: 'success',
        data: { match: true, type: 'proposal', reference: proposalDocument },
      });
    }

    await AuditLog.create({
      actionType: 'VERIFICACION_CIUDADANA',
      description: `Hash ${hash} no coincide con ningún registro (posible alteración o inexistente).`,
    });
    res.status(200).json({ status: 'success', data: { match: false } });
  } catch (err) {
    next(err);
  }
}

import fs from 'fs';
import { Tender, CompanyInfo } from '../infrastructure/models/associations.js';
import { AuditLog } from '../infrastructure/models/associations.js';
import { sha256Buffer } from '../services/hash.service.js';
import { HttpError } from '../services/auth.service.js';

const REQUIRED_FIELDS = ['title', 'processNumber', 'description', 'category', 'publicationDate', 'deadline'];

export async function createTender(req, res, next) {
  try {
    const missing = REQUIRED_FIELDS.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      throw new HttpError(400, `Faltan campos obligatorios: ${missing.join(', ')}.`);
    }
    if (!req.file) {
      throw new HttpError(400, 'El documento del pliego (PDF) es obligatorio.');
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const documentHash = sha256Buffer(fileBuffer);

    const tender = await Tender.create({
      title: req.body.title,
      processNumber: req.body.processNumber,
      description: req.body.description,
      category: req.body.category,
      budget: req.body.budget || null,
      publicationDate: req.body.publicationDate,
      deadline: req.body.deadline,
      requirements: req.body.requirements || null,
      documentPath: req.file.filename,
      documentHash,
      createdByUserId: req.user.id,
    });

    await AuditLog.create({
      userId: req.user.id,
      actionType: 'LICITACION_PUBLICADA',
      entityType: 'Tender',
      entityId: tender.id,
      description: `Licitación "${tender.title}" publicada con hash ${documentHash}.`,
    });

    res.status(201).json({ status: 'success', data: tender });
  } catch (err) {
    next(err);
  }
}

export async function listTenders(req, res, next) {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;

    const tenders = await Tender.findAll({
      where,
      include: [{ model: CompanyInfo, as: 'awardedCompany', attributes: ['id', 'companyName'] }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ status: 'success', data: tenders });
  } catch (err) {
    next(err);
  }
}

export async function listMyTenders(req, res, next) {
  try {
    const tenders = await Tender.findAll({
      where: { createdByUserId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ status: 'success', data: tenders });
  } catch (err) {
    next(err);
  }
}

export async function getTender(req, res, next) {
  try {
    const tender = await Tender.findByPk(req.params.id, {
      include: [{ model: CompanyInfo, as: 'awardedCompany', attributes: ['id', 'companyName'] }],
    });
    if (!tender) throw new HttpError(404, 'Licitación no encontrada.');
    res.status(200).json({ status: 'success', data: tender });
  } catch (err) {
    next(err);
  }
}

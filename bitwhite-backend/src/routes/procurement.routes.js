import { Router } from 'express';
import * as procurementController from '../controllers/procurement.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { uploadPdf } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', procurementController.listTenders);
router.get('/mine', requireAuth, requireRole('gobierno'), procurementController.listMyTenders);
router.get('/:id', procurementController.getTender);
router.post(
  '/',
  requireAuth,
  requireRole('gobierno'),
  uploadPdf.single('documentoPliego'),
  procurementController.createTender
);

export default router;

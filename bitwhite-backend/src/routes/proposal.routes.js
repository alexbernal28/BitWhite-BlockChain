import { Router } from 'express';
import * as proposalController from '../controllers/proposal.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { uploadPdf } from '../middlewares/upload.middleware.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('empresa'),
  uploadPdf.single('documento'),
  proposalController.submitProposal
);

export default router;

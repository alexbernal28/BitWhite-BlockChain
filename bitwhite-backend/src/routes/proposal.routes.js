import { Router } from 'express';
import * as proposalController from '../controllers/proposal.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { uploadPdf } from '../middlewares/upload.middleware.js';

const router = Router();

// Rutas literales ('/mine', '/tender/:tenderId') deben declararse antes que
// '/:id' para que Express no las confunda con un id de propuesta.
router.get('/mine', requireAuth, requireRole('empresa'), proposalController.listMyProposals);
router.get('/tender/:tenderId', requireAuth, requireRole('gobierno'), proposalController.listProposalsForTender);
router.get('/:id', requireAuth, proposalController.getProposal);

router.post(
  '/',
  requireAuth,
  requireRole('empresa'),
  uploadPdf.single('documento'),
  proposalController.submitProposal
);

export default router;

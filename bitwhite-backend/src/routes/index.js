import { Router } from 'express';
import authRoutes from './auth.routes.js';
import procurementRoutes from './procurement.routes.js';
import proposalRoutes from './proposal.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/procurement', procurementRoutes);
router.use('/proposals', proposalRoutes);
router.use('/audit', auditRoutes);

export default router;

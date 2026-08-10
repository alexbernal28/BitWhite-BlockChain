import { Router } from 'express';
import * as auditController from '../controllers/audit.controller.js';

const router = Router();

router.post('/verify', auditController.verifyHash);

export default router;

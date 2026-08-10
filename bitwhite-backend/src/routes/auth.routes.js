import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register/ciudadano', authController.registerCiudadano);
router.post('/register/empresa', authController.registerEmpresa);
router.post('/login', authController.login);

export default router;

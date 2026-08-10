import { verifyToken } from '../services/token.service.js';

/**
 * Exige un JWT válido (Authorization: Bearer <token>) y adjunta la
 * información del usuario autenticado en req.user.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ status: 'error', message: 'Token de autenticación requerido.' });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ status: 'error', message: 'Token inválido o expirado.' });
  }
}

/**
 * Debe usarse después de requireAuth. Restringe el acceso a los roles
 * indicados (coincide con Role.name: ciudadano | empresa | gobierno | administrador).
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'No tienes permiso para realizar esta acción.' });
    }
    return next();
  };
}

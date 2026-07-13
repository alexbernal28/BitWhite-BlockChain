import JwtTokenManager from '../../../infrastructure/security/JwtTokenManager.js';

const tokenManager = new JwtTokenManager();

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Acceso denegado. No se proporcionó un token válido.'
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = tokenManager.verify(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado.'
    });
  }

  req.user = decoded; // Contiene id, email, role
  next();
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Rol insuficiente para realizar esta acción.'
      });
    }

    next();
  };
}

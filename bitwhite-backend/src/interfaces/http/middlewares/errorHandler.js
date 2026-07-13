export default function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Personalizar respuestas para errores comunes de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación de datos',
      details: err.errors.map(e => e.message)
    });
  }

  res.status(status).json({
    success: false,
    error: message
  });
}

/**
 * Middleware de manejo de errores centralizado. Los servicios lanzan
 * HttpError (services/auth.service.js) con un `status` HTTP explícito;
 * cualquier otro error se trata como 500.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ status: 'error', message: err.message || 'Error interno del servidor.' });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ status: 'error', message: 'Recurso no encontrado.' });
}

import * as authService from '../services/auth.service.js';

export async function registerCiudadano(req, res, next) {
  try {
    const result = await authService.registerCiudadano(req.body);
    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

export async function registerEmpresa(req, res, next) {
  try {
    const result = await authService.registerEmpresa(req.body);
    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

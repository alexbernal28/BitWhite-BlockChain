import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '24h' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

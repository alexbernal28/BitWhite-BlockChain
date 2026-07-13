import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default class JwtTokenManager {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'super_secret_bitwhite_token_key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  generate(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}

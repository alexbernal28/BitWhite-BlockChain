import RegisterUser from '../../../../application/auth/RegisterUser.js';
import LoginUser from '../../../../application/auth/LoginUser.js';
import GetMe from '../../../../application/auth/GetMe.js';
import SequelizeUserRepository from '../../../../infrastructure/repositories/auth/SequelizeUserRepository.js';
import BcryptHasher from '../../../../infrastructure/security/BcryptHasher.js';
import JwtTokenManager from '../../../../infrastructure/security/JwtTokenManager.js';

const userRepository = new SequelizeUserRepository();
const passwordHasher = new BcryptHasher();
const tokenManager = new JwtTokenManager();

const registerUserUseCase = new RegisterUser(userRepository, passwordHasher);
const loginUserUseCase = new LoginUser(userRepository, passwordHasher, tokenManager);
const getMeUseCase = new GetMe(userRepository);

export default class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, roleName } = req.body;
      const result = await registerUserUseCase.execute({ name, email, password, roleName });
      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await loginUserUseCase.execute({ email, password });
      return res.status(200).json({
        success: true,
        message: 'Autenticación exitosa',
        data: result
      });
    } catch (error) {
      error.status = 401;
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await getMeUseCase.execute(userId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      error.status = 404;
      next(error);
    }
  }
}

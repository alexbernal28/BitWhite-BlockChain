export default class LoginUser {
  constructor(userRepository, passwordHasher, tokenManager) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const roleName = user.role ? user.role.name : 'ciudadano';

    const token = this.tokenManager.generate({
      id: user.id,
      email: user.email,
      role: roleName
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName
      }
    };
  }
}

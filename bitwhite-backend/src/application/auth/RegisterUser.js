import User from '../../domain/auth/User.js';

export default class RegisterUser {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ name, email, password, roleName = 'ciudadano' }) {
    if (!name || !email || !password) {
      throw new Error('Todos los campos (nombre, email, contraseña) son requeridos');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const role = await this.userRepository.findRoleByName(roleName);
    if (!role) {
      throw new Error(`El rol especificado (${roleName}) no es válido`);
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roleId: role.id
    });

    const savedUser = await this.userRepository.save(newUser);
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: roleName,
      createdAt: savedUser.createdAt
    };
  }
}

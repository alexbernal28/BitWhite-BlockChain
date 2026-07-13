export default class GetMe {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const roleName = user.role ? user.role.name : 'ciudadano';

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      createdAt: user.createdAt
    };
  }
}

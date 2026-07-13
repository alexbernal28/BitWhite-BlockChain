import UserRepository from '../../../domain/auth/UserRepository.js';
import UserEntity from '../../../domain/auth/User.js';
import RoleEntity from '../../../domain/auth/Role.js';
import UserModel from '../../models/auth/User.js';
import RoleModel from '../../models/auth/Role.js';

export default class SequelizeUserRepository extends UserRepository {
  async save(userEntity) {
    const user = await UserModel.create({
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      roleId: userEntity.roleId
    });
    return this._toEntity(user);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({
      where: { email },
      include: [{ model: RoleModel, as: 'role' }]
    });
    if (!user) return null;
    return this._toEntity(user);
  }

  async findById(id) {
    const user = await UserModel.findByPk(id, {
      include: [{ model: RoleModel, as: 'role' }]
    });
    if (!user) return null;
    return this._toEntity(user);
  }

  async findRoleByName(name) {
    const role = await RoleModel.findOne({ where: { name } });
    if (!role) return null;
    return new RoleEntity({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    });
  }

  async seedRoles(roles) {
    for (const roleData of roles) {
      await RoleModel.findOrCreate({
        where: { name: roleData.name },
        defaults: { description: roleData.description }
      });
    }
  }

  _toEntity(userModel) {
    const role = userModel.role
      ? new RoleEntity({
          id: userModel.role.id,
          name: userModel.role.name,
          description: userModel.role.description,
          createdAt: userModel.role.createdAt,
          updatedAt: userModel.role.updatedAt
        })
      : null;

    return new UserEntity({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      password: userModel.password,
      roleId: userModel.roleId,
      role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }
}

export default class User {
  constructor({ id, name, email, password, roleId, role = null, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roleId = roleId;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

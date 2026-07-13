export default class Role {
  constructor({ id, name, description = null, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

import bcrypt from 'bcryptjs';
import sequelize from '../infrastructure/persistence/database.js';
import { User, Role, CitizenInfo, CompanyInfo } from '../infrastructure/models/associations.js';
import { signToken } from './token.service.js';

const SALT_ROUNDS = 10;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function getRoleByName(name) {
  const role = await Role.findOne({ where: { name } });
  if (!role) {
    throw new HttpError(500, `El rol "${name}" no existe. Ejecuta el script de siembra (seed) primero.`);
  }
  return role;
}

function buildAuthResponse(user, role, profile) {
  const token = signToken({ id: user.id, rolId: user.rolId, role: role.name, email: user.email });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role.name,
      profile,
    },
  };
}

export async function registerCiudadano({ name, email, password, cedula, phone }) {
  if (!name || !email || !password || !cedula) {
    throw new HttpError(400, 'Nombre, correo, contraseña y cédula son obligatorios.');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new HttpError(400, 'Ya existe una cuenta registrada con ese correo electrónico.');

  const role = await getRoleByName('ciudadano');
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return sequelize.transaction(async (t) => {
    const user = await User.create({ name, email, password: hashedPassword, rolId: role.id }, { transaction: t });
    const citizenInfo = await CitizenInfo.create(
      { userId: user.id, cedula, phone },
      { transaction: t }
    );
    return buildAuthResponse(user, role, citizenInfo);
  });
}

export async function registerEmpresa({
  name,
  email,
  password,
  companyName,
  rnc,
  razonSocial,
  address,
  sectorEconomico,
  phone,
  cargoEmpresa,
  provincia,
}) {
  if (!name || !email || !password || !companyName || !rnc || !razonSocial || !sectorEconomico || !phone || !cargoEmpresa || !provincia) {
    throw new HttpError(400, 'Faltan campos obligatorios para registrar la empresa.');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new HttpError(400, 'Ya existe una cuenta registrada con ese correo electrónico.');

  const existingRnc = await CompanyInfo.findOne({ where: { rnc } });
  if (existingRnc) throw new HttpError(400, 'Ya existe una empresa registrada con ese RNC.');

  const role = await getRoleByName('empresa');
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return sequelize.transaction(async (t) => {
    const user = await User.create({ name, email, password: hashedPassword, rolId: role.id }, { transaction: t });
    const companyInfo = await CompanyInfo.create(
      {
        userId: user.id,
        companyName,
        rnc,
        razon_social: razonSocial,
        address,
        sector_economico: sectorEconomico,
        phone,
        cargo_empresa: cargoEmpresa,
        provincia,
      },
      { transaction: t }
    );
    return buildAuthResponse(user, role, companyInfo);
  });
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, 'Correo y contraseña son obligatorios.');
  }

  const user = await User.findOne({ where: { email }, include: [{ model: Role, as: 'role' }] });
  if (!user) throw new HttpError(401, 'Credenciales inválidas.');

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw new HttpError(401, 'Credenciales inválidas.');

  let profile = null;
  if (user.role.name === 'ciudadano') {
    profile = await CitizenInfo.findOne({ where: { userId: user.id } });
  } else if (user.role.name === 'empresa') {
    profile = await CompanyInfo.findOne({ where: { userId: user.id } });
  }

  return buildAuthResponse(user, user.role, profile);
}

export { HttpError };

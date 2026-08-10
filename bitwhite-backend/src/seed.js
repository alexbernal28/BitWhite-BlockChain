import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from './infrastructure/persistence/database.js';
import { User, Role, CitizenInfo, CompanyInfo } from './infrastructure/models/associations.js';

const DEMO_PASSWORD = 'Demo1234!';

const ROLES = [
  { name: 'ciudadano', description: 'Consulta pública de licitaciones y verificación de auditoría.' },
  { name: 'empresa', description: 'Participa en licitaciones enviando propuestas.' },
  { name: 'gobierno', description: 'Publica y administra licitaciones de su institución.' },
  { name: 'administrador', description: 'Gestiona usuarios, empresas, licitaciones y auditorías.' },
];

async function ensureRoles() {
  for (const role of ROLES) {
    await Role.findOrCreate({ where: { name: role.name }, defaults: role });
  }
  console.log('Roles verificados/creados.');
}

async function ensureUser({ name, email, roleName, profile }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log(`Ya existe una cuenta demo para ${email}, se omite.`);
    return;
  }

  const role = await Role.findOne({ where: { name: roleName } });
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  await sequelize.transaction(async (t) => {
    const user = await User.create({ name, email, password: hashedPassword, rolId: role.id }, { transaction: t });

    if (roleName === 'ciudadano') {
      await CitizenInfo.create({ userId: user.id, ...profile }, { transaction: t });
    } else if (roleName === 'empresa') {
      await CompanyInfo.create({ userId: user.id, ...profile }, { transaction: t });
    }
  });

  console.log(`Cuenta demo creada: ${email} / ${DEMO_PASSWORD}`);
}

async function seed() {
  try {
    await ensureRoles();

    await ensureUser({
      name: 'Administración BitWhite',
      email: 'gobierno@bitwhite.gob.do',
      roleName: 'gobierno',
    });

    await ensureUser({
      name: 'Constructora Demo SRL',
      email: 'empresa@bitwhite.gob.do',
      roleName: 'empresa',
      profile: {
        companyName: 'Constructora Demo SRL',
        rnc: '1-30-12345-6',
        razon_social: 'Constructora Demo, S.R.L.',
        address: 'Av. Winston Churchill 100, Santo Domingo',
        sector_economico: 'Construcción e infraestructura',
        phone: '(809) 555-0100',
        cargo_empresa: 'Representante legal',
        provincia: 'Distrito Nacional',
      },
    });

    await ensureUser({
      name: 'Ciudadano Demo',
      email: 'ciudadano@bitwhite.gob.do',
      roleName: 'ciudadano',
      profile: { cedula: '001-0000000-1', phone: '(809) 555-0200' },
    });

    console.log('Siembra completada.');
    process.exit(0);
  } catch (error) {
    console.error('Error al sembrar datos demo:', error.message);
    process.exit(1);
  }
}

seed();

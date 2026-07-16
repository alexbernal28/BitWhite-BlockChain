import sequelize from './infrastructure/persistence/database.js';
import createSchemas from './infrastructure/persistence/schemas.js';

// Importa todos los modelos para que Sequelize los registre
import './infrastructure/models/auth/User.js';
import './infrastructure/models/auth/Role.js';
import './infrastructure/models/auth/CompanyInfo.js';
import './infrastructure/models/auth/CitizenInfo.js';
// Agrega aquí los demás modelos cuando los vayas definiendo

async function syncDatabase() {
  try {
    await createSchemas();           // Crea los schemas
    await sequelize.sync({ force: false }); // Crea las tablas si no existen
    console.log('Tablas creadas correctamente en PostgreSQL');
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar:', error.message);
    process.exit(1);
  }
}

syncDatabase();
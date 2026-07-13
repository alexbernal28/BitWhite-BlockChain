import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import sequelize from './infrastructure/persistence/database.js';
import createSchemas from './infrastructure/persistence/schemas.js';
import User from './infrastructure/models/auth/User.js';
import Role from './infrastructure/models/auth/Role.js';
import SequelizeUserRepository from './infrastructure/repositories/auth/SequelizeUserRepository.js';
import authRoutes from './interfaces/http/routes/auth/authRoutes.js';
import errorHandler from './interfaces/http/middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares estándar
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Registro de Rutas
app.use('/api/auth', authRoutes);

// Endpoint de verificación de estado
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Manejador centralizado de errores
app.use(errorHandler);

// Inicialización de base de datos y arranque del servidor
async function startServer() {
  try {
    // 1. Autenticar conexión con la base de datos
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // 2. Crear esquemas de base de datos si no existen
    await createSchemas();

    // 3. Sincronizar los modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('Modelos de la base de datos sincronizados con éxito.');

    // 4. Alimentar (seed) roles por defecto
    const userRepository = new SequelizeUserRepository();
    await userRepository.seedRoles([
      { name: 'ciudadano', description: 'Portal de auditoría ciudadana y consulta libre' },
      { name: 'empresa', description: 'Portal de empresas proveedoras y licitantes' },
      { name: 'gobierno', description: 'Panel institucional para entidades gubernamentales' }
    ]);
    console.log('Roles iniciales verificados y sembrados.');

    // 5. Iniciar la escucha del servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor de BitWhite corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

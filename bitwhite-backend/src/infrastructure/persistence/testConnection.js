import sequelize from './database.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL');
  } catch (error) {
    console.error('Error de conexión');
    console.error(error.message);
  }
}

testConnection();
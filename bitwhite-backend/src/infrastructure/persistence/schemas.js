import sequelize from './database.js';

async function createSchemas() {
    try{
        await sequelize.createSchema("auth");
        await sequelize.createSchema("organizations");
        await sequelize.createSchema("procurement");
        await sequelize.createSchema("proposals");
        await sequelize.createSchema("blockchain");
        await sequelize.createSchema("audit");
    }catch{}
    console.log("Schemas creados.");
}
export default createSchemas;

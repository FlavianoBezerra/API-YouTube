import knex from 'knex';
import knexConfig from './knexfile';

const db = knex(knexConfig);

const runMigrations = async () => {
  try {
    console.log('Iniciando a aplicação das migrações...');
    await db.migrate.latest();
    console.log('Migrações aplicadas com sucesso!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao aplicar as migrações:', error.message);
      console.error('Stack Trace:', error.stack);      
    } else {
      console.error('Erro desconhecido:', error);
    }
  } finally {
    await db.destroy();
    console.log('Conexão com o banco fechada.');
  }
};

export { db, runMigrations }; //npx ts-node migrate.ts, para exutar as migrações!
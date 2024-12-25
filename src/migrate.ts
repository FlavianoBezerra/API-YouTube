import knex from 'knex';
import knexConfig from './knexfile';

const configMigrate = knex(knexConfig);

async function runMigrations() {
  try {
    await configMigrate.migrate.latest();
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Error running migrations', error);
  } finally {
    configMigrate.destroy();
    console.log('Connection closed');
  }
}

runMigrations();
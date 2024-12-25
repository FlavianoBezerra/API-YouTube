require('ts-node/register');  // Registra o ts-node para rodar TypeScript
import { config } from 'dotenv';
import { Knex } from 'knex';

config();

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './dist/migrations'
  }
};

export default knexConfig;
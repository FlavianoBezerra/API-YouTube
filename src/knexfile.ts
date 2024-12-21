import { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
};

export default knexConfig;
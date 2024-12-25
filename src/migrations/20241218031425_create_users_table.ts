import { Knex } from 'knex';

export const up = (knex: Knex): Promise<void> => {
  return knex.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
    table.increments('user_id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  }).then(() => {
    console.log('Table created successfully');
  });
};

export const down = (knex: Knex): Promise<void> => {
  return knex.schema.dropTableIfExists('users').then(() => {
    console.log('Table dropped successfully');
  });
};
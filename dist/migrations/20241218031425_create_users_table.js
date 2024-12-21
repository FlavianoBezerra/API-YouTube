"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (knex) => {
    return knex.schema.createTable('users', (table) => {
        table.increments('user_id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.timestamps(true, true);
    });
};
exports.up = up;
const down = (knex) => {
    return knex.schema.dropTableIfExists('users');
};
exports.down = down;

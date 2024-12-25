"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (knex) => {
    return knex.schema.createTable('videos', (table) => {
        table.increments('video_id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('video_title').notNullable();
        table.string('video_description').notNullable();
        table.string('image_url').notNullable();
        table.timestamp('post_time').defaultTo(knex.fn.now());
        table.timestamps(true, true);
        table.foreign('user_id').references('users.user_id').onDelete('CASCADE'); // Deleta os vídeos se o usuário for deletado
    }).then(() => {
        console.log('Table created successfully');
    });
};
exports.up = up;
const down = (knex) => {
    return knex.schema.dropTableIfExists('videos').then(() => {
        console.log('Table dropped successfully');
    });
};
exports.down = down;

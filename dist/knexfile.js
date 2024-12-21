"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knexConfig = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
};
exports.default = knexConfig;

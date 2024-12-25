"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('ts-node/register'); // Registra o ts-node para rodar TypeScript
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const knexConfig = {
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
exports.default = knexConfig;

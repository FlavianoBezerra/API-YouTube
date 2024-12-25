"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("./knexfile"));
const configMigrate = (0, knex_1.default)(knexfile_1.default);
async function runMigrations() {
    try {
        await configMigrate.migrate.latest();
        console.log('Migrations completed!');
    }
    catch (error) {
        console.error('Error running migrations', error);
    }
    finally {
        configMigrate.destroy();
        console.log('Connection closed');
    }
}
runMigrations();

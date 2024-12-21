"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("./knexfile"));
const db = (0, knex_1.default)(knexfile_1.default);
exports.db = db;
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Iniciando a aplicação das migrações...');
        yield db.migrate.latest();
        console.log('Migrações aplicadas com sucesso!');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao aplicar as migrações:', error.message);
            console.error('Stack Trace:', error.stack);
        }
        else {
            console.error('Erro desconhecido:', error);
        }
    }
    finally {
        yield db.destroy();
        console.log('Conexão com o banco fechada.');
    }
});
exports.runMigrations = runMigrations;

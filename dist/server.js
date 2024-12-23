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
const express_1 = __importDefault(require("express"));
const migrate_1 = require("./migrate");
const user_routes_1 = require("./routes/user.routes");
const videos_routes_1 = require("./routes/videos.routes");
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Configuração do CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Permite solicitações de localhost:3000 (ajuste conforme necessário)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Middleware para ler o corpo das requisições em JSON
app.use(express_1.default.json());
app.use('/user', user_routes_1.userRoutes);
app.use('/videos', videos_routes_1.videosRoutes);
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, migrate_1.runMigrations)();
        console.log('Migrações aplicadas com sucesso!');
    }
    catch (error) {
        console.error('Erro ao aplicar as migrações:', error);
        process.exit(1);
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeDatabase();
    app.listen(4000, () => {
        console.log('Server is running on http://localhost:4000');
    });
});
startServer();

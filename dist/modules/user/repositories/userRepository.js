"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const knex_1 = __importDefault(require("knex"));
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    async create(request, response) {
        const { name, email, password } = request.body;
        try {
            const existingUser = await (0, knex_1.default)('users').where({ email }).first();
            if (existingUser) {
                return response.status(409).json({ message: "E-mail já existente" });
            }
            const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
            const userId = (0, uuid_1.v4)(); // Gerando UUID
            await (0, knex_1.default)('users').insert({
                user_id: userId,
                name,
                email,
                password: hashedPassword,
            });
            return response.status(200).json({ message: 'Usuário criado com sucesso.' });
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar usuário', error });
        }
    }
    async login(request, response) {
        const { email, password } = request.body;
        try {
            const user = await (0, knex_1.default)('users').where({ email }).first();
            if (!user) {
                console.warn('Email não encontrado:', email);
                return response.status(400).json({ error: 'Email não encontrado. Por favor, forneça um email válido.' });
            }
            const isMatch = await (0, bcrypt_1.compare)(password, user.password);
            if (isMatch) {
                const token = (0, jsonwebtoken_1.sign)({ id: user.user_id, email: user.email }, process.env.SECRET, { expiresIn: '1d' });
                return response.status(200).json({ token, message: 'Autenticado com sucesso.' });
            }
            else {
                console.warn('Senha incorreta para email:', email);
                return response.status(400).json({ error: 'Senha incorreta.' });
            }
        }
        catch (error) {
            console.error('Erro na autenticação:', error);
            return response.status(500).json({ error: 'Erro na sua autenticação!' });
        }
    }
    async getUser(request, response) {
        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).send({
                error: "Token de autorização não fornecido.",
                response: null
            });
        }
        try {
            const decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
            if (!decode.email) {
                return response.status(401).send({
                    error: "Token de autorização inválido.",
                    response: null
                });
            }
            const user = await (0, knex_1.default)('users').where({ email: decode.email }).first();
            if (!user) {
                return response.status(404).send({
                    error: "Usuário não encontrado.",
                    response: null
                });
            }
            return response.status(200).send({
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.user_id
                }
            });
        }
        catch (err) {
            return response.status(401).send({
                error: "Token de autorização inválido.",
                response: null
            });
        }
    }
}
exports.UserRepository = UserRepository;

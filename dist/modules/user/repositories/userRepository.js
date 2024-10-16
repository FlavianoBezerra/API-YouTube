"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err);
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)', [(0, uuid_1.v4)(), name, email, hash], (error, results, fileds) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error);
                    }
                    ;
                    response.status(200).json({ message: 'Usuário criado com sucesso.' });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM  users WHERE email=?', [email], (error, results, fileds) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro na sua autenticação!' });
                }
                ;
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (err) {
                        return response.status(400).json({ error: 'Erro na sua autenticação!' });
                    }
                    if (result) {
                        // Gerar o token
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email
                        }, process.env.SECRET, { expiresIn: '1d' });
                        return response.status(200).json({ token: token, message: 'Autenticado com sucesso.' });
                    }
                });
            });
        });
    }
    getUser(request, response) {
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
            mysql_1.pool.getConnection((error, conn) => {
                if (error) {
                    return response.status(500).send({
                        error: "Erro de conexão com o banco de dados.",
                        response: null
                    });
                }
                conn.query('SELECT * FROM users WHERE email=?', [decode.email], (error, results, fields) => {
                    conn.release();
                    if (error) {
                        return response.status(500).send({
                            error: "Erro de consulta ao banco de dados.",
                            response: null
                        });
                    }
                    if (results.length === 0) {
                        return response.status(404).send({
                            error: "Usuário não encontrado.",
                            response: null
                        });
                    }
                    return response.status(200).send({
                        user: {
                            name: results[0].name,
                            email: results[0].email,
                            id: results[0].user_id
                        }
                    });
                });
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

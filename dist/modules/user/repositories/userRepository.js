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
            if (err) {
                return response.status(500).json(err);
            }
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    connection.release();
                    return response.status(500).json(err);
                }
                connection.query('SELECT email FROM users WHERE email = ?', [email], (error, result) => {
                    if (error) {
                        connection.release();
                        return response.status(500).json(error);
                    }
                    if (result.length > 0) {
                        connection.release();
                        return response.status(409).json({ message: "E-mail já existente" });
                    }
                    connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)', [(0, uuid_1.v4)(), name, email, hash], (error) => {
                        connection.release();
                        if (error) {
                            return response.status(400).json(error);
                        }
                        response.status(200).json({ message: 'Usuário criado com sucesso.' });
                    });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ error: 'Erro ao conectar ao banco de dados.' });
            }
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                connection.release();
                if (error) {
                    console.error('Erro na consulta ao banco de dados:', error);
                    return response.status(500).json({ error: 'Erro na consulta ao banco de dados!' });
                }
                if (!results || results.length === 0) {
                    console.warn('Email não encontrado:', email);
                    return response.status(400).json({ error: 'Email não encontrado. Por favor, forneça um email válido.' });
                }
                const user = results[0];
                if (!user || !user.password) {
                    console.warn('Usuário não encontrado ou senha não disponível para email:', email);
                    return response.status(400).json({ error: 'Usuário não encontrado ou senha não disponível.' });
                }
                (0, bcrypt_1.compare)(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.error('Erro ao comparar senhas:', err);
                        return response.status(500).json({ error: 'Erro na sua autenticação!' });
                    }
                    if (isMatch) {
                        const token = (0, jsonwebtoken_1.sign)({ id: user.user_id, email: user.email }, process.env.SECRET, { expiresIn: '1d' });
                        return response.status(200).json({ token, message: 'Autenticado com sucesso.' });
                    }
                    else {
                        console.warn('Senha incorreta para email:', email);
                        return response.status(400).json({ error: 'Senha incorreta.' });
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

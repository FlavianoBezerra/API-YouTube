import { pool } from "../../../mysql";
import { v4 as uuidv4  } from 'uuid';
import { hash, compare } from  "bcrypt";
import { sign, verify } from  'jsonwebtoken';
import { Request, Response } from "express";

class UserRepository {
    create(request: Request, response: Response){
        const { name, email, password } = request.body;
        pool.getConnection((err: any, connection: any) => {
            hash(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err)
                }

                connection.query(
                    'INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)',
                    [uuidv4(), name, email, hash],
                    (error: any, results: any, fileds:any) => {
                        connection.release();
                        if (error) {
                            return response.status(400).json(error);
                        };
        
                        response.status(200).json({ message: 'Usuário criado com sucesso.' })
                    }
                )
            })
        })
    }

    login(request: Request, response: Response) {
        const { email, password } = request.body;
    
        pool.getConnection((err: any, connection: any) => {
            if (err) {
                return response.status(500).json({ error: 'Erro ao conectar ao banco de dados.' });
            }
    
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (error: any, results: any) => {
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
    
                    compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.error('Erro ao comparar senhas:', err);
                            return response.status(500).json({ error: 'Erro na sua autenticação!' });
                        }
    
                        if (isMatch) {
                            const token = sign(
                                { id: user.user_id, email: user.email },
                                process.env.SECRET as string,
                                { expiresIn: '1d' }
                            );
    
                            return response.status(200).json({ token, message: 'Autenticado com sucesso.' });
                        } else {
                            console.warn('Senha incorreta para email:', email);
                            return response.status(400).json({ error: 'Senha incorreta.' });
                        }
                    });
                }
            );
        });
    }    

    getUser(request: any, response: any) {
        const token = request.headers.authorization;
    
        if (!token) {
            return response.status(401).send({
                error: "Token de autorização não fornecido.",
                response: null
            });
        }
    
        try {
            const decode: any = verify(token, process.env.SECRET as string);
    
            if (!decode.email) {
                return response.status(401).send({
                    error: "Token de autorização inválido.",
                    response: null
                });
            }
    
            pool.getConnection((error, conn) => {
                if (error) {
                    return response.status(500).send({
                        error: "Erro de conexão com o banco de dados.",
                        response: null
                    });
                }
    
                conn.query(
                    'SELECT * FROM users WHERE email=?',
                    [decode.email],
                    (error, results, fields) => {
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
                    }
                );
            });
        } catch (err) {
            return response.status(401).send({
                error: "Token de autorização inválido.",
                response: null
            });
        }
    }
    
}

export { UserRepository };
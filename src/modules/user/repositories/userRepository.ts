import knex from 'knex';
import { v4 as uuidv4  } from 'uuid';
import { hash, compare } from  "bcrypt";
import { sign, verify } from  'jsonwebtoken';
import { Request, Response } from "express";

class UserRepository {
    async create(request: Request, response: Response) {
        const { email, password, name } = request.body;
    
        try {
            const existingUser = await knex('users').where({ email }).first();
    
            if (existingUser) {
                return response.status(409).json({ message: "E-mail já existente" });
            }

            const hashedPassword = await hash(password, 10);

            const userId = uuidv4();  // Gerando UUID
    
            await knex('users').insert({
                user_id: userId,
                name,
                email,
                password: hashedPassword,
            });
    
            return response.status(200).json({ message: 'Usuário criado com sucesso.' });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar usuário', error });
        }
    }    

    async login(request: Request, response: Response) {
        const { email, password } = request.body;
    
        try {
            const user = await knex('users').where({ email }).first();
    
            if (!user) {
                console.warn('Email não encontrado:', email);
                return response.status(400).json({ error: 'Email não encontrado. Por favor, forneça um email válido.' });
            }

            const isMatch = await compare(password, user.password);
    
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
        } catch (error) {
            console.error('Erro na autenticação:', error);
            return response.status(500).json({ error: 'Erro na sua autenticação!' });
        }
    }    

    async getUser(request: Request, response: Response) {
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

            const user = await knex('users').where({ email: decode.email }).first();
    
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
        } catch (err) {
            return response.status(401).send({
                error: "Token de autorização inválido.",
                response: null
            });
        }
    }    
}

export { UserRepository };
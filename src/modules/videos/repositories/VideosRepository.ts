import { pool } from "../../../mysql";
import { v4 as uuidv4  } from 'uuid';
import { Request, Response } from "express";

class VideoRepository {
    static create(request: Request, response: Response) {
        const { user_id, videoTitle, videoDescription, imageUrl, post_time } = request.body;

        if (!user_id || !videoTitle || !videoDescription || !imageUrl || !post_time) {
            return response.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const formattedPostTime = new Date(post_time).toISOString().slice(0, 19).replace('T', ' ');
        
        pool.getConnection((err: any, connection: any) => {
            if (err) {
                return response.status(500).json({ message: 'Erro ao conectar com o banco de dados.', error: err });
            }
            connection.query(
                'INSERT INTO videos (video_id, user_id, videoTitle, videoDescription, imageUrl, post_time) VALUES (?, ?, ?, ?, ?, ?)',
                [uuidv4(), user_id, videoTitle, videoDescription, imageUrl, formattedPostTime],
                (error: any, results: any, fields: any) => {
                    connection.release(); // Libera a conexão após a consulta

                    if (error) {
                        console.error('Erro ao salvar no banco de dados:', error);
                        return response.status(400).json({ message: 'Erro ao salvar o vídeo no banco de dados.', error: error });
                    }

                    response.status(200).json({ message: 'Vídeo criado com sucesso.' });
                }
            );
        });
    }

    getVideos( request: Request, response: Response ){
        const { user_id } = request.body;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM  videos WHERE user_id=?',
                [ user_id ],
                (error: any, results: any, fileds:any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({error: 'Erro ao buscar os vídeos!'});
                    };
                    return response.status(200).json({ message: 'Vídeos retornados com sucesso.', videos: results });
                }
            )
        })
    }

    searchVideos( request: Request, response: Response ){
        const { search } = request.query;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM  videos WHERE title LIKE ? OR description LIKE ?',
                [ `%${ search }%`, `%${ search }%` ],
                (error: any, results: any, fileds:any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({error: 'Erro ao buscar os vídeos!'});
                    };
                    return response.status(200).json({ message: 'Vídeos retornados com sucesso.', videos: results });
                }
            )
        })
    }
}

export { VideoRepository };
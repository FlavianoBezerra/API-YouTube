"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    constructor() {
        this.getVideos = (request, response) => {
            const { user_id } = request.params;
            mysql_1.pool.getConnection((err, connection) => {
                if (err) {
                    return response.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
                }
                connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro ao buscar os vídeos!' });
                    }
                    if (results.length === 0) {
                        return response.status(404).json({ message: 'Nenhum vídeo encontrado para esse usuário.' });
                    }
                    return response.status(200).json({ message: 'Vídeos retornados com sucesso.', videos: results });
                });
            });
        };
    }
    static create(request, response) {
        const { user_id, videoTitle, videoDescription, imageUrl, post_time } = request.body;
        if (!user_id || !videoTitle || !videoDescription || !imageUrl || !post_time) {
            return response.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        const formattedPostTime = new Date(post_time).toISOString().slice(0, 19).replace('T', ' ');
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ message: 'Erro ao conectar com o banco de dados.', error: err });
            }
            connection.query('INSERT INTO videos (video_id, user_id, videoTitle, videoDescription, imageUrl, post_time) VALUES (?, ?, ?, ?, ?, ?)', [(0, uuid_1.v4)(), user_id, videoTitle, videoDescription, imageUrl, formattedPostTime], (error, results, fields) => {
                connection.release(); // Libera a conexão após a consulta
                if (error) {
                    console.error('Erro ao salvar no banco de dados:', error);
                    return response.status(400).json({ message: 'Erro ao salvar o vídeo no banco de dados.', error: error });
                }
                response.status(200).json({ message: 'Vídeo criado com sucesso.' });
            });
        });
    }
    searchVideos(request, response) {
        const { search } = request.query;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM  videos WHERE title LIKE ? OR description LIKE ?', [`%${search}%`, `%${search}%`], (error, results, fileds) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro ao buscar os vídeos!' });
                }
                ;
                return response.status(200).json({ message: 'Vídeos retornados com sucesso.', videos: results });
            });
        });
    }
}
exports.VideoRepository = VideoRepository;

import knex from 'knex';
import { v4 as uuidv4  } from 'uuid';
import { Request, Response } from "express";

class VideoRepository {
    async create(request: Request, response: Response) {
        const { user_id, videoTitle, videoDescription, imageUrl, post_time } = request.body;

        if (!user_id || !videoTitle || !videoDescription || !imageUrl || !post_time) {
            return response.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const formattedPostTime = new Date(post_time).toISOString().slice(0, 19).replace('T', ' ');
    
        try {
            await knex('videos').insert({
                video_id: uuidv4(),
                user_id,
                video_title: videoTitle,
                video_description: videoDescription,
                image_url: imageUrl,
                post_time: formattedPostTime,
            });

            return response.status(200).json({ message: 'Vídeo criado com sucesso.' });
        } catch (error) {
            console.error('Erro ao salvar no banco de dados:', error);
            return response.status(400).json({ message: 'Erro ao salvar o vídeo no banco de dados.', error: error });
        }
    }

    async getVideos(request: Request, response: Response) {
        const { user_id } = request.params;
    
        try {
            const videos = await knex('videos').where({ user_id });
    
            if (videos.length === 0) {
                return response.status(404).json({ message: 'Nenhum vídeo encontrado para esse usuário.' });
            }

            return response.status(200).json({ message: 'Vídeos retornados com sucesso.', videos });
        } catch (error) {
            console.error('Erro ao buscar os vídeos:', error);
            return response.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }
    }
    
    async searchVideos(request: Request, response: Response) {
        const { search } = request.query;
    
        try {
            const videos = await knex('videos')
                .where('video_title', 'like', `%${search}%`)
                .orWhere('video_description', 'like', `%${search}%`);
    
             if (videos.length === 0) {
                return response.status(404).json({ message: 'Nenhum vídeo encontrado para a pesquisa.' });
            }

            return response.status(200).json({ message: 'Vídeos retornados com sucesso.', videos });
        } catch (error) {
            console.error('Erro ao buscar os vídeos:', error);
            return response.status(400).json({ error: 'Erro ao buscar os vídeos!' });
        }
    }
}

export { VideoRepository };
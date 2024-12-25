import { Router } from "express";
import { VideoRepository } from "../modules/videos/repositories/videosRepository";
import { login } from "../middleware/login";

const videosRoutes = Router();
const videoRepository = new VideoRepository();
 
videosRoutes.post('/create-video/:user_id', login, (request, response) => {
    videoRepository.create(request, response);
});

videosRoutes.get( '/get-video/:user_id', login, (request, response) => {
    videoRepository.getVideos(request, response);
})

videosRoutes.get( '/search-video', (request, response) => {
    videoRepository.searchVideos(request, response);
})

export { videosRoutes };
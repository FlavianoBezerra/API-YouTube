"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoutes = void 0;
const express_1 = require("express");
const videosRepository_1 = require("../modules/videos/repositories/videosRepository");
const login_1 = require("../middleware/login");
const videosRoutes = (0, express_1.Router)();
exports.videosRoutes = videosRoutes;
const videoRepository = new videosRepository_1.VideoRepository();
videosRoutes.post('/create-video/:user_id', login_1.login, (request, response) => {
    videoRepository.create(request, response);
});
videosRoutes.get('/get-video/:user_id', login_1.login, (request, response) => {
    videoRepository.getVideos(request, response);
});
videosRoutes.get('/search-video', (request, response) => {
    videoRepository.searchVideos(request, response);
});

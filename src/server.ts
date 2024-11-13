import express from 'express';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';
import { config } from 'dotenv';
import cors from 'cors';

config();
const app = express();

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/videos', videosRoutes);

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

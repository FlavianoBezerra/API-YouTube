import express from  'express';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';
import { config } from 'dotenv';
import cors from 'cors';

config();
const app = express();

app.use(function(request, response, next){
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});

app.use(cors()); //middleware

app.use(express.json());
app.use('/user', userRoutes);
app.use('/videos', videosRoutes);

app.listen(3000);
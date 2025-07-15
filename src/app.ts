import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { Request, Response } from 'express';
import alertRoutes from './routes/alertRoutes';
import userRoutes from './routes/userRoutes';
import invitationRoutes from './routes/invitationRoutes';
const app = express();

// Load environment variables from .env file
dotenv.config();

//grand MiddleWares
app.use(express.json());
app.use(cors());

//Routes
alertRoutes(app);
userRoutes(app);
invitationRoutes(app);
alertRoutes(app);

app.get('/ping', (_req: Request, res:Response) => {
    res.send("Pong");
})


export default app;
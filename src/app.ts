import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { Request, Response } from 'express';
import alertRoutes from './routes/alertRoutes';
import userRoutes from './routes/userRoutes';
import invitationRoutes from './routes/invitationRoutes';
import customerRoutes from './routes/customerRoutes';
import deviceRoutes from './routes/deviceRoutes';
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
customerRoutes(app);
deviceRoutes(app);

app.get('/ping', (_req: Request, res:Response) => {
    res.send("Pong");
})


export default app;
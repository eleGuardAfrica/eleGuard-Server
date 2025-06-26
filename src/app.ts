import express from 'express'
import cors from 'cors'

import { Request, Response } from 'express';
import alertRoutes from './routes/alertRoutes';
const app = express();


//grand MiddleWares
app.use(express.json());
app.use(cors());

//Routes
alertRoutes(app);

app.get('/ping', (_req: Request, res:Response) => {
    res.send("Pong");
})


export default app;
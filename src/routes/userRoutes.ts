import express, {Express, Router } from 'express'
import * as userController from '../controllers/userController'

const router: Router = express.Router();

const userRoutes = (app: Express) : Express => {
    router.post('/login', userController.login);
    router.post('/invite', userController.sendInvitation);
    
    return app.use('/users', router);
}


//CRUD
export default userRoutes
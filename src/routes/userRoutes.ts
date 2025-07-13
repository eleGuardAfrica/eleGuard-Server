import express, {Express, Router } from 'express'
import * as userController from '../controllers/userController'

const router: Router = express.Router();

const userRoutes = (app: Express) : Express => {
    router.post('/login', userController.login);
    router.post('/signUp', userController.signUp);
    
    return app.use('/users', router);
}


//CRUD
export default userRoutes
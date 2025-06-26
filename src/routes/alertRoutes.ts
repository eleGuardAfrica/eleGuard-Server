import express, {Express, Router } from 'express'
import * as alertController from '../controllers/alertController'

const router: Router = express.Router();

const alertRoutes = (app: Express) : Express => {
    router.post('/:deviceId', alertController.receiveAlert);
    
    return app.use('/alert', router);
}


//CRUD
export default alertRoutes
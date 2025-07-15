import express, {Express, Router } from 'express'
import * as alertController from '../controllers/alertController'

const router: Router = express.Router();

const alertRoutes = (app: Express) : Express => {
    router.post('/:deviceId', alertController.receiveAlert);
    router.get('/recent/:limit', alertController.getRecentAlerts);
    router.get('', alertController.getAlerts);
    
    return app.use('/alerts', router);
}


//CRUD
export default alertRoutes
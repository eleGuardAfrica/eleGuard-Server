import express, {Express, Router } from 'express'
import * as deviceController from '../controllers/deviceController'

const router: Router = express.Router();

const deviceRoutes = (app: Express) : Express => {
    router.post('', deviceController.addDevice);
    router.patch('/:id', deviceController.updateDevice);
    
    return app.use('/devices', router);
}


//CRUD
export default deviceRoutes
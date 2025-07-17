import express, {Express, Router } from 'express'
import * as customerController from '../controllers/customerController'

const router: Router = express.Router();

const customerRoutes = (app: Express) : Express => {
    router.post('', customerController.addCustomer);
    router.get('', customerController.getCustomers);
    
    return app.use('/customers', router);
}


//CRUD
export default customerRoutes


import express, {Express, Router } from 'express'
import * as invitationController from '../controllers/invitationController'

const router: Router = express.Router();

const invitationRoutes = (app: Express) : Express => {
    router.post('/invite', invitationController.sendInvitation);
    router.post('/verify', invitationController.verifyInvitation);
    
    return app.use('/invitations', router);
}


//CRUD
export default invitationRoutes
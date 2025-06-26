import { Request, Response} from 'express'
import { CreateResponse } from '../utils/response'

// import { send_sms } from '../services/sendsms';

// const getDeviceNotificationReceivers = async (id) => {
//     const device = await Device.find(id)
//     return device.notifyList;
// }

export const receiveAlert = async (req: Request, res: Response) : Promise<Response> => {
   try{
        const { deviceId } = req.params;
        //Will send an sms when fully configured
        //send_sms(`Alert on device ${deviceId}`, getDeviceNotificationReceivers(deviceId))
        return res.json(CreateResponse(true, `device ${deviceId} is sending an Alert`));
    }catch(error){
        return res.json(CreateResponse(false, null, error))
    }
}
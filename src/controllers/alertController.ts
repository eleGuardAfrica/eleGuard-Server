import { Request, Response} from 'express';
import { CreateResponse } from '../utils/response';
import Alert from '../models/Alert';
import Device from '../models/Device';

// import { send_sms } from '../services/sms';

// const getDeviceNotificationReceivers = async (id) => {
//     const device = await Device.find(id)
//     return device.notifyList;
// }

//   deviceId: Types.ObjectId;
//   customerId?: Types.ObjectId;
//   type: "intrusion" | "low_battery" | "device_offline" | "maintenance";
//   severity: "low" | "medium" | "high" | "critical";
//   message: string;
//   location: string;
//   timestamp: Date;
//   acknowledged: boolean;
//   acknowledgedBy?: Types.ObjectId;
//   acknowledgedAt?: Date;


export const receiveAlert = async (req: Request, res: Response) : Promise<Response> => {
   try{
        const { deviceId, type, severity, message, location, timestamp, acknowledged } = req.params;

        const device = Device.findOne({deviceId});

        //Will send an sms when fully configured
        //send_sms(`Alert on device ${deviceId}`, getDeviceNotificationReceivers(deviceId))
        return res.json(CreateResponse(true, `device ${deviceId} is sending an Alert`));
    }catch(error){
        return res.json(CreateResponse(false, null, error))
    }
}

export const getAlerts = async (req: Request, res: Response): Promise<Response> => {
    try{
        const alerts = await Alert.find();
        if(!alerts){
            return res.json(CreateResponse(false, null, "Failed to get Alerts"));
        }
        return res.json(CreateResponse(true, alerts));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getRecentAlerts = async (req:Request, res:Response): Promise<Response> => {
    try{
        const { limit } = req.params;
        const _limit = Number(limit);
        if (isNaN(_limit) || _limit <= 0) {
            return res.json(CreateResponse(false, null, "Invalid limit parameter"));
        }
        const alerts = await Alert.find().sort({ createdAt: -1 }).limit(_limit);
        if(!alerts || alerts.length === 0){
            return res.json(CreateResponse(false, null, "No recent alerts found"));
        }
        return res.json(CreateResponse(true, alerts));
    }catch (err){
        return res.json(CreateResponse(false, null, err instanceof Error ? err.message : String(err)));
    }
}
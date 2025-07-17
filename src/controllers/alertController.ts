import { Request, Response} from 'express';
import { CreateResponse } from '../utils/response';
import Alert from '../models/Alert';
import Device from '../models/Device';
import Customer from '../models/Customer';

import { send_sms } from '../services/sms';

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



export const postAlert = async (req: Request, res: Response) : Promise<Response> => {
   try{
        const { serialNumber, type, severity, message, location } = req.body;
        const device = await Device.findOne({serialNumber});
        if (!device) {
            return res.json(CreateResponse(false, null, `Device with id ${serialNumber} not found`));
        }

        send_sms("Ndugu, Kuna Tembo Shambani.", device.listToBeNotified);

        const customerId = device.customerId;
        const customer_alert_updated = await Customer.findOneAndUpdate({_id: customerId}, {$push: {alerts: serialNumber}});
        if (!customer_alert_updated) {
            return res.json(CreateResponse(false, null, "Failed to update customer alerts"));
        }

        const saved = await Alert.create({serialNumber, customerId, type, severity, message, location});

        if (!saved) {
            return res.json(CreateResponse(false, null, "Failed to save alert"));
        }

        //Handle Alerting
        //Will send an sms when fully configured
        //send_sms(`Alert on device ${deviceId}`, getDeviceNotificationReceivers(deviceId))
        return res.json(CreateResponse(true, `device ${serialNumber} is sending an Alert`));
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

export const getCustomerAlerts = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { customerId } = req.params;
        const customer_alerts = await Customer.findOne({_id: customerId}).select("alerts");
        if (!customer_alerts) {
            return res.json(CreateResponse(false, null, `Customer with id ${customerId} not found`));
        }
        return res.json(CreateResponse(true, customer_alerts));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getDeviceAlerts = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { deviceId } = req.params;
        const device_alerts = await Device.findOne({_id: deviceId}).select("alerts");
        if (!device_alerts) {
            return res.json(CreateResponse(false, null, `Device with id ${deviceId} not found`));
        }
        return res.json(CreateResponse(true, device_alerts));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}
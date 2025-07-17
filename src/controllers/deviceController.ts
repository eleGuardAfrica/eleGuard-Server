import { Request, Response} from 'express';
import { CreateResponse } from '../utils/response';
import Device from '../models/Device';


//only api for creating device and updating device

export const addDevice = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { serialNumber, isUsed } = req.body;
        const device = await Device.create({serialNumber, isUsed});
        if (!device) {
            return res.json(CreateResponse(false, null, "Failed to add Device"));
        }
        return res.json(CreateResponse(true, device));
    }
    catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const updateDevice = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { deviceId } = req.params;
        const { serialNumber, customerId, location, batteryLevel, status } = req.body;
        const device = await Device.findOneAndUpdate({_id: deviceId}, {$set: {serialNumber, customerId, location, batteryLevel, status}});
        if (!device) {
            return res.json(CreateResponse(false, null, `Device with id ${deviceId} not found`));
        }
        return res.json(CreateResponse(true, device));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

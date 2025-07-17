import { Request, Response} from 'express';
import { CreateResponse } from '../utils/response';
import Customer from '../models/Customer';


//get Customers
//add Customer
//update Customer
//delete Customer


export const getCustomers = async (req: Request, res: Response): Promise<Response> => {
    try{
        const customers = await Customer.find();
        if(!customers){
            return res.json(CreateResponse(false, null, "Failed to get Customers"));
        }
        return res.json(CreateResponse(true, customers));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getCustomer = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { customerId } = req.params;
        const customer = await Customer.findOne({_id: customerId});
        if (!customer) {
            return res.json(CreateResponse(false, null, `Customer with id ${customerId} not found`));
        }
        return res.json(CreateResponse(true, customer));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const addCustomer = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { name, email, phoneNumber, location, devices } = req.body;
        const customer = await Customer.create({name, email, phoneNumber, location, devices});
        if (!customer) {
            return res.json(CreateResponse(false, null, "Failed to add Customer"));
        }
        return res.json(CreateResponse(true, customer));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const updateCustomer = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { customerId } = req.params;
        const { name, email, phoneNumber, location } = req.body;
        const customer = await Customer.findOneAndUpdate({_id: customerId}, {$set: {name, email, phoneNumber, location}});
        if (!customer) {
            return res.json(CreateResponse(false, null, `Customer with id ${customerId} not found`));
        }
        return res.json(CreateResponse(true, customer));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const deleteCustomer = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { customerId } = req.params;
        const customer = await Customer.findOneAndDelete({_id: customerId});
        if (!customer) {
            return res.json(CreateResponse(false, null, `Customer with id ${customerId} not found`));
        }
        return res.json(CreateResponse(true, customer));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getCustomerDevices = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { customerId } = req.params;
        const customer = await Customer.findOne({_id: customerId});
        if (!customer) {
            return res.json(CreateResponse(false, null, `Customer with id ${customerId} not found`));
        }
        return res.json(CreateResponse(true, customer));
    }catch (error){
        return res.json(CreateResponse(false, null, error));
    }
}


import { Request, Response } from 'express'
import { CreateResponse } from '../utils/response'
import User from '../models/User';
import Invitation, { IInvitation } from '../models/Invitation';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend';
import { validateEmail, generateOTP, generateOTPExpiryDate } from '../utils/authHelpers';
import { EmailService } from '../services/mail'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(CreateResponse(false, null, 'Email and password are required'));
        }
        // Explicitly select password SINCE in the model it is configured not to be returned!!
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json(CreateResponse(false, null, 'Invalid Credentials'));
        }
        if (!user.password) {
            return res.status(500).json(CreateResponse(false, null, 'User password not set'));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(CreateResponse(false, null, 'Invalid Credentials'));
        }
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Remove password from user object before sending to frontend by CONVERTING it back to object
        const userObj = user.toObject();
        delete userObj.password;
        return res.json(CreateResponse(true, { user: userObj, token }, 'Login successful'));
    } catch (error: any) {
        return res.status(500).json(CreateResponse(false, null, error.message || 'Server Error'));
    }
}

//   name: string
//   email: string
//   password: string
//   phoneNumber: number
//   isAdmin: boolean
//   isSuperAdmin?: boolean
//   createdBy?: Types.ObjectId
//   createdUsers?: Types.ObjectId[]
//   deviceId?: Types.ObjectId
//   refreshTokens?: string[]


export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneNumber, password, isAdmin, createdBy } = req.body;
        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json(CreateResponse(false, null, 'Name, email, phone number and password are required'));
        }
        const user = await User.create({ name, email, password, phoneNumber, isAdmin, createdBy});
        await User.updateOne({ _id: createdBy }, { $push: { createdUsers: user._id } });
        return res.json(CreateResponse(true, null, 'Signup successful'));
    }catch(error){
        return res.json(CreateResponse(false, null, error))
    }
}

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

export const signIn = async (req: Request, res: Response) => {

}

export const sendInvitation = async (req: Request, res: Response) => {
    try {

        const { newUserEmail, makeAdmin, currentUser} = req.body;
        
        const isValidEmail = validateEmail(newUserEmail)
        if (!isValidEmail) {
            return res.json(CreateResponse(false, null, "Please enter a valid email address"));
        }else console.log("Email iko fresh")
        
        const userExists = await User.findOne({ newUserEmail });

        if(userExists){
            return res.json(CreateResponse(false, null, "User with this email already exists"));
        }else console.log("User iko fresh")
        
        const exisitingInvitation = await Invitation.findOne({ email: newUserEmail });
        if(exisitingInvitation){
            return res.json(CreateResponse(false, null, "Invitation already sent to this email"));
        }else console.log("Invitation iko fresh, ndo ya kwanza hii")

        const otp = generateOTP();

        const invitation: IInvitation = {
            email: newUserEmail,
            otp: otp,
            isAdmin: makeAdmin,
            createdBy: currentUser?._id,
            expiresAt: generateOTPExpiryDate(12),
        }
        console.log("Itaexpire kama tarehe ya ")
        console.log(invitation.expiresAt)
        // const emailIsSent = await sendInvitationEmail(newUserEmail, otp)
        const emailIsSent = await EmailService.sendInvitationEmail({
            recipientEmail: newUserEmail,
            otp: otp,
            expiresAt: invitation.expiresAt,
            invitedBy: currentUser?.name || "An Eleguard Admin"
        })
        
        if(!emailIsSent){
            return res.json(CreateResponse(false, null, "Email could not be sent"));
        }else console.log("Email iko fresh, imetumwa yani")
        
        const invitationIsSaved = await Invitation.create(invitation)

        if(!invitationIsSaved){
            return res.json(CreateResponse(false, null, "Invitation could not be saved"));
        }
        
        return res.json(CreateResponse(true, "Invitation sent successfully"));
        
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }

    //things to PASS TO API
    //{newUserEmail, makeAdmin, currentUser}
    //Things to do IN backend --> check it user exists already
    // ---> check if invitation is sent already
    // --> Generate OTP and create Invitation
    // --> Send Email
    // --> Add to invitations collections
}
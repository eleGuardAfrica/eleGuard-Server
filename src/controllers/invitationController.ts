import { Request, Response} from 'express'
import { CreateResponse } from '../utils/response'
import User from '../models/User';
import Invitation, { IInvitation } from '../models/Invitation';
import { validateEmail, generateOTP, generateOTPExpiryDate } from '../utils/authHelpers';
import { EmailService } from '../services/mail'


export const verifyInvitation = async (req: Request, res: Response) => {
    try {
        const { email, otp} = req.body;
        if (!email || !otp) {
            return res.status(400).json(CreateResponse(false, null, 'Email and OTP are required'));
        }
        const invited = await Invitation.findOne({ email, otp });
        if (!invited) {
            return res.status(404).json(CreateResponse(false, null, 'Invitation not found'));
        }
        const deleted = await Invitation.deleteOne({ email, otp });
        if (!deleted) {
            return res.status(500).json(CreateResponse(false, null, 'Invitation could not be deleted'));
        }
        return res.json(CreateResponse(true, invited));
    }catch(error){
        return res.json(CreateResponse(false, null, error))
    }
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


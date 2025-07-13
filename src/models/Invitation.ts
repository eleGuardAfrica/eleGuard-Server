import mongoose, { Schema, Types } from "mongoose"

export interface IInvitation{
  email: string
  isAdmin : boolean
  otp: string
  createdBy: Types.ObjectId
  expiresAt: Date
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
      expires: 0, // To Delete Document when time reaches.
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", InvitationSchema)
import mongoose, { Schema, type Document, Types } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email?: string
  phoneNumber: string
  location: string
  devices: string[]
  alerts?: string[]
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      index: true,
    },
    email: String,
    phoneNumber: String,
    location: String,
    devices: [String],
    alerts: [String],
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema)

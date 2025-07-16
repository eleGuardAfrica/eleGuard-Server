import mongoose, { Schema, type Document, Types } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email?: string
  phoneNumber: string
  location: string
  devices: Types.ObjectId[]
  alerts: string[]
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
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) => /^0\d{9}$/.test(v),
        message: "Phone number must start with 0 and be exactly 10 digits",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
      index: true,
    },
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
    alerts: [
      {
        type: String,
        trim: true,
        maxlength: [500, "Alert cannot exceed 500 characters"],
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema)

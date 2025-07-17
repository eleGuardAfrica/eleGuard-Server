import mongoose, { Schema, type Document, Types } from "mongoose"

export interface IPersonToNotify {
  name: string
  phoneNumber: string
}

export interface IDevice extends Document {
  serialNumber: string
  isUsed: boolean
  customerId?: Types.ObjectId
  customerName?: string
  location?: string
  batteryLevel?: number
  lastSeen?: Date
  status?: "active" | "inactive" | "maintenance"
  listToBeNotified?: IPersonToNotify[]
  createdAt: Date
  updatedAt: Date
}

const PersonToNotifySchema = new Schema<IPersonToNotify>(
  {
    name: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) => /^0\d{9}$/.test(v),
        message: "Phone number must start with 0 and be exactly 10 digits",
      },
    },
  },
  { _id: false },
)

const DeviceSchema = new Schema<IDevice>(
  {
    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    },
    customerName: String,
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
      index: true,
    },
    batteryLevel: {
      type: Number,
      min: [0, "Battery level cannot be negative"],
      max: [100, "Battery level cannot exceed 100"],
      default: 100,
      index: true,
    },
    lastSeen: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "inactive",
      index: true,
    },
    listToBeNotified: [PersonToNotifySchema],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Device || mongoose.model<IDevice>("Device", DeviceSchema)

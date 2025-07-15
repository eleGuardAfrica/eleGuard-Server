import mongoose, { Schema, type Document, Types } from "mongoose"

export interface IAlert extends Document {
  deviceId: Types.ObjectId;
  customerId?: Types.ObjectId;
  type: "intrusion" | "low_battery" | "device_offline" | "maintenance";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  location: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: Types.ObjectId;
  acknowledgedAt?: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: [true, "Device ID is required"],
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    },
    type: {
      type: String,
      enum: ["intrusion", "low_battery", "device_offline", "maintenance"],
      required: [true, "Alert type is required"],
      index: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: [true, "Alert severity is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Alert message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: -1,
    },
    acknowledged: {
      type: Boolean,
      default: false,
      index: true,
    },
    acknowledgedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    acknowledgedAt: Date,
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema)

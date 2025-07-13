import mongoose, { Schema, type Document, Types } from "mongoose"

export interface IBilling extends Document {
  customerId: Types.ObjectId
  customerName: string
  plan: "basic" | "premium" | "enterprise"
  monthlyFee: number
  devicesIncluded: number
  additionalDeviceFee: number
  currentDevices: number
  lastBillingDate: Date
  nextBillingDate: Date
  status: "active" | "overdue" | "suspended"
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

const BillingSchema = new Schema<IBilling>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
      index: true, // Only index here, not in both schema and below
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    plan: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      required: [true, "Plan is required"],
    },
    monthlyFee: {
      type: Number,
      required: [true, "Monthly fee is required"],
      min: [0, "Monthly fee cannot be negative"],
    },
    devicesIncluded: {
      type: Number,
      required: [true, "Devices included is required"],
      min: [1, "Must include at least 1 device"],
    },
    additionalDeviceFee: {
      type: Number,
      required: [true, "Additional device fee is required"],
      min: [0, "Additional device fee cannot be negative"],
    },
    currentDevices: {
      type: Number,
      default: 0,
      min: [0, "Current devices cannot be negative"],
    },
    lastBillingDate: {
      type: Date,
      required: [true, "Last billing date is required"],
    },
    nextBillingDate: {
      type: Date,
      required: [true, "Next billing date is required"],
      index: true, // Only index here, not in both schema and below
    },
    status: {
      type: String,
      enum: ["active", "overdue", "suspended"],
      default: "active",
      index: true, // Only index here, not in both schema and below
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Billing || mongoose.model<IBilling>("Billing", BillingSchema)

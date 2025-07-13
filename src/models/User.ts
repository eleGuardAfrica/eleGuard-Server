
import mongoose, { Schema, type Document, Types } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phoneNumber: number
  isAdmin: boolean
  createdBy?: Types.ObjectId
  createdUsers?: Types.ObjectId[]
  refreshTokens?: string[]
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: number) => /^7\d{8}$/.test(v.toString()),
        message: "Phone number must be 9 digits starting with 7",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    createdUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(Number.parseInt(process.env.BCRYPT_ROUNDS || "12"))
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

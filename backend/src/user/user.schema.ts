import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  };

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
      },
      credit: {
        type: Number,
        default: 100,
      },
      apiKey: {
        type: String,
        unique: true,
        sparse: true  // This allows null values without causing unique constraint violations
      },
      refreshToken: {
        type: String,
      },
      subscribedApis: [{
        api: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Api",
        },
        hit: {
          type: Number,
          default: 0
        }
      }],
      active: {
        type: Boolean,
        default: true,
      },
}, {
  timestamps: true,
});

// Drop any existing indexes on subscribedApis.apiKey


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      (this as any).password = await hashPassword((this as any).password);
    }
    next();
  });
  
export default mongoose.model<IUser>("User", userSchema);
  
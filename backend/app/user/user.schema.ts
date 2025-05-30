import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    wallet: {
      balance: { type: Number, default: 0 },
      freeCredits: { type: Number, default: 100 }
    },
    apps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    (this as any).password = await hashPassword((this as any).password);
  }
  next();
});

const UserSchema = mongoose.model("User", userSchema);

export default UserSchema;

import mongoose from "mongoose";
import { type IUser } from "./user.dto";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};


const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    password: { type: String, required: true },
    wallet: {
    balance: { type: Number, default: 0 },
    freeCredits: { type: Number, default: 100 }
    },
    apps: [{ type: Schema.Types.ObjectId, ref: 'App' }],
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    (this as any).password = await hashPassword((this as any).password);
  }
  next();
});

export default mongoose.model<IUser>("user", UserSchema);

import mongoose from "mongoose";
import { type IApp } from "./app.dto";

const appSchema = new mongoose.Schema<IApp>(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    apiKey: { type: mongoose.Schema.Types.ObjectId, ref: "ApiKey" },
    subscribedApis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    blockedApis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AppSchema = mongoose.model<IApp>("App", appSchema);

export default AppSchema;

import mongoose from "mongoose";
import { type IApp } from "./app.dto";

const Schema = mongoose.Schema;

const AppSchema = new Schema<IApp>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    apiKey: { type: Schema.Types.ObjectId, ref: 'Apikey' },
    subscribedApis: [{ type: Schema.Types.ObjectId, ref: 'Service', required: false }],
    blockedApis: [{ type: Schema.Types.ObjectId, ref: 'Service', required: false }]
  },
  { timestamps: true },
);

export default mongoose.model<IApp>("app", AppSchema);

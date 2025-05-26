import mongoose from "mongoose";
import { type IApikey } from "./apikey.dto";

const Schema = mongoose.Schema;

const ApikeySchema = new Schema<IApikey>(
  {
    key: { type: String, required: true },
    app: { type: Schema.Types.ObjectId, ref: 'App', required: true },
    isActive: { type: Boolean, required: false }
  },
  { timestamps: true },
);

export default mongoose.model<IApikey>("apikey", ApikeySchema);

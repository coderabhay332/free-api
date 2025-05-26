import mongoose from "mongoose";
import { type IService } from "./service.dto";

const Schema = mongoose.Schema;

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    pricePerCall: { type: Number, required: true },
    endpoint: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<IService>("service", ServiceSchema);

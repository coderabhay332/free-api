import mongoose from "mongoose";
import { type IService } from "./service.dto";

const serviceSchema = new mongoose.Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String },
    endpoint: { type: String, required: true },
    pricePerCall: { type: Number, required: true },
    active: { type: Boolean, default: true },
    hitStats: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      hitCount: { type: Number, default: 0 }
    }],
  },
  { timestamps: true }
);

const ServiceSchema = mongoose.model("Service", serviceSchema);

export default ServiceSchema;

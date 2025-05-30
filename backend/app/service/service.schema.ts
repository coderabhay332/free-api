import mongoose from "mongoose";
import { type IService } from "./service.dto";

const serviceSchema = new mongoose.Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String },
    endpoint: { type: String, required: true },
    pricePerCall: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const serviceStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  hitCount: { type: Number, default: 0 },
  lastHit: { type: Date, default: Date.now },
  hitHistory: [{
    timestamp: { type: Date, default: Date.now },
    responseTime: { type: Number }, // in milliseconds
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' }
  }]
}, { timestamps: true });

serviceStatsSchema.index({ user: 1, service: 1 }, { unique: true });
serviceStatsSchema.index({ 'hitHistory.timestamp': -1 });

const ServiceSchema = mongoose.model("Service", serviceSchema);
export const ServiceStatsSchema = mongoose.model("ServiceStats", serviceStatsSchema);

export default ServiceSchema;

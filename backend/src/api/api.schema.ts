import mongoose, { model, Schema } from "mongoose";
import { type IApi } from "./api.dto";


const apiSchema = new Schema<IApi>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE"],
    required: true,
  },
  pricePerRequest: {
    type: Number,
    required: true,
    default: 0,
  },
  callCount: {
    type: Number,
    default: 0,
  },
  subscribedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {timestamps: true});



export default mongoose.model<IApi>("Api", apiSchema);

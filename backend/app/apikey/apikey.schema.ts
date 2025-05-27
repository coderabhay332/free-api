import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    app: { type: mongoose.Schema.Types.ObjectId, ref: "App", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ApiKeySchema = mongoose.model("ApiKey", apiKeySchema);

export default ApiKeySchema;

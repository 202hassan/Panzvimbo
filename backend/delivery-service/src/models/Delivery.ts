import mongoose, { Schema, Document } from "mongoose";

export type DeliveryStatus =
  | "pending"
  | "bidding"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IDelivery extends Document {
  clientId: mongoose.Types.ObjectId;
  courierId?: mongoose.Types.ObjectId;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  packageDetails: {
    description: string;
    weight: number;
    size: "small" | "medium" | "large";
  };
  suggestedPrice: number;
  status: DeliveryStatus;
}

const DeliverySchema: Schema<IDelivery> = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, required: true },
    courierId: { type: Schema.Types.ObjectId },
    pickupLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
    },
    dropoffLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
    },
    packageDetails: {
      description: { type: String, required: true },
      weight: { type: Number, required: true },
      size: {
        type: String,
        enum: ["small", "medium", "large"],
        required: true,
      },
    },
    suggestedPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "bidding", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Delivery = mongoose.model<IDelivery>("Delivery", DeliverySchema);


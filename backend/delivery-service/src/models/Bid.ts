import mongoose, { Schema, Document } from "mongoose";

export type BidStatus = "pending" | "accepted" | "rejected";

export interface IBid extends Document {
  deliveryId: mongoose.Types.ObjectId;
  courierId: mongoose.Types.ObjectId;
  amount: number;
  estimatedTime: number;
  message?: string;
  status: BidStatus;
}

const BidSchema: Schema<IBid> = new Schema(
  {
    deliveryId: { type: Schema.Types.ObjectId, required: true },
    courierId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    estimatedTime: { type: Number, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Bid = mongoose.model<IBid>("Bid", BidSchema);


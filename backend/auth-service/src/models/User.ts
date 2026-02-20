import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "client" | "courier" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: UserRole;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["client", "courier", "admin"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = mongoose.model<IUser>("User", UserSchema);


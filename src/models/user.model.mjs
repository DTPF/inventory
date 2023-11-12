import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: String,
    email: { type: String, required: true, unique: true },
    password: String,
    phone_number: String,
    birth_date: Date,
    settings: {
      language: String,
      notifications: Boolean,
    },
    metadata: {
      email_verified: Boolean,
      rate: String,
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export default UserModel;
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    user_data: {
      firstname: { type: String, required: true },
      lastname: String,
      email: { type: String, required: true, unique: true },
      password: String,
      tel_prefix: String,
      tel_suffix: String,
      birth_date: Date,
    },
    // inventory: [{
    //   type: Schema.Types.ObjectId,
    //   ref: "Inventory",
    // }],
    inventory: Schema.Types.ObjectId,
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    locations: [{
      type: Schema.Types.ObjectId,
      ref: "Location",
    }],
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
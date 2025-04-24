import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    ethAddress: {
      type: String,
      required: true,
      
    },
    role: {
      type: String,
      enum: ["admin", "donor", "beneficiary"],
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      enum: ["south", "east", "west", "center", "malir", "korangi", "keamari"],
      required: true,
    },
    subDivison: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
    },
    encryptionKey: {
      type: Buffer,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: "",
    },
    passwordResetExpires: {
      type: Date,
      default: new Date() },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

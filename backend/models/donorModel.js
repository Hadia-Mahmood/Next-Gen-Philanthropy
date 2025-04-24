import mongoose from "mongoose";

const DonationRecordSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevents automatic _id generation for subdocuments
);

const DonorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure one donor record per user
    },
    donations: [DonationRecordSchema],
    totalAmountDonated: {
      type: Number,
      default: 0,
    },
    campaignsDonatedTo: {
      type: Number,
      default: 0,
    },
    nftIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NFT",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Donor", DonorSchema);

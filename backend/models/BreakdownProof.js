import mongoose from "mongoose";
const BreakdownProofSchema = new mongoose.Schema(
    {  
      breakdownId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true, // Links proof to a breakdown
      },
      proofStatus: {
        type: String,
        enum: ["approved", "rejected", "waiting"],
        default: "waiting",
      },
      breakdownFileHash:
      {
        type: String,
       
        default: null,
      },
      
      usageSummary: {
        type: String,
        required: true, // Explanation of how funds were spent
      },
      completionDate: {
        type: Date,
        required: true,
      },
      thirdPartyVerification: {
        name: { type: String, required: true },
        contactNumber: { type: String, required: true },
        email: { type: String, required: true },
      },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("BreakdownProof", BreakdownProofSchema);
  
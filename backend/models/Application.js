import mongoose from "mongoose";

const BreakdownSchema = new mongoose.Schema({
  needId: {
    type: Number,
    // required: true,
  }, 
  
  purpose: {
    type: String,
    required: true, // Purpose of breakdown (e.g., Medical, Rent, Food)
  },
  amount: {
    type: Number,
    required: true, // Amount allocated for this breakdown
  },
  amountRaised: {   // Amount collected for this particular breakdown
    type: Number
  },
  description: {
    type: String,
    required: true, // Details about this fund allocation
  },
  documentHash: {
    type: String,
   
    default: null,
  },
  breakdownStatus: { //is this open to receive breakdown donation spent proof
    type: String,
    enum: ["active", "inactive","completed","fulfilled"],
    default: "inactive",
  },
  
    
}, { timestamps: true });
const DonationSchema = new mongoose.Schema({
  donorAddress: {
    type: String,
    required: true, 
  },
  amount: {
    type: Number,
    required: true, // Amount donated 
  },
  donatedAt: {
    type: Date,
    default: Date.now,
  }
});
const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  campaignId: {
    type: Number,
    // required: true,
  }, 
  applicationPicture: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  applicationTitle: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  occupation: { type: String },
  description: { type: String, required: true }, // Reason for assistance
  deadline: { type: Date, required: true },
  amountRequested: { type: Number, required: true },
  amountRaised: { type: Number},
  monthlyIncome: { type: Number },
  sourceOfIncome: { type: String },
  otherAidSources: { type: String },
  bankDetails: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountHolder: { type: String, required: true },
    branchCode: { type: String },
  }, 
  applicationStatus: {
    type: String,
    enum: ["fulfilled", "rejected", "in progress"],
    default: "in progress",
  }, // If the application is approved, is it completed or not
  applicationApproval: {
    type: String,
    enum: ["yes", "no", "waiting"],
    default: "waiting",
  },
  breakdowns: [BreakdownSchema], // Embedded Breakdown Array
  donations: [DonationSchema],
}, { timestamps: true });

export default mongoose.model("Application", ApplicationSchema);








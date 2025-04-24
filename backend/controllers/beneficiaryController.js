import Application from "../models/Application.js";
import BreakdownProof from "../models/BreakdownProof.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";



export const createApplication = async (req, res) => {
  try {
    console.log("req.body",req.body);
    const { 
      userId, name, age, gender, applicationTitle, contact, address, occupation, 
      description, deadline, amountRequested, monthlyIncome, sourceOfIncome, 
      otherAidSources, bankDetails, breakdowns 
    } = req.body;
    const existingApplication = await Application.findOne({ 
      userId, 
      applicationStatus: "in progress" 
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: "You already have an active application in progress." 
      });
    }
    
const updatedBreakdowns = breakdowns.map((breakdown, index) => ({
  ...breakdown,
  needId: index,
  
}));


    const myCloud = await cloudinary.v2.uploader.upload(req.body.applicationPicture, {
      folder: "application_pictures",
      width: 500,
      crop: "scale",
    });

    const newApplication = new Application({
      userId,
      name,
      age,
      gender,
      applicationTitle,
      contact,
      address,
      occupation,
      description,
      deadline,
      amountRequested,
      monthlyIncome,
      sourceOfIncome,
      otherAidSources,
      bankDetails,
      breakdowns: updatedBreakdowns,
      applicationPicture: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    await newApplication.save();

    return res.status(201).json({
      message: "Application created successfully.",
      application: newApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicationData = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const application = await Application.findOne({ userId, applicationStatus: "in progress" });
    
    if (!application) {
      return res.status(404).json({ error: "No in-progress application found for this user" });
    }
    
    const totalAmountRequired = application.amountRequested;
    const isApproved = application.applicationApproval;
    const daysLeft = Math.max(
      Math.ceil((new Date(application.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
      0
    );
    const totalBreakdowns = application.breakdowns.length;

    res.json({
      totalAmountRequired,
      isApproved,
      daysLeft,
      totalBreakdowns,
    });
  } catch (error) {
    console.error("Error fetching application data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllApplicationData = async (req, res) => {
    try {
      const { userId } = req.body;
      console.log(userId);
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      // Fetch all approved applications for the user
      const applications = await Application.find({
        userId,
        applicationApproval: "yes",
      }).select("applicationPicture applicationStatus amountRequested _id");
  
      
      if (applications.length === 0) {
        console.log("No approved applications found for this user");
        return res.status(200).json({ applications: [] }); // Return an empty array instead of 404
      }
  
      
      // Prepare the response data
      const responseData = applications.map((app) => ({
        applicationID: app._id,
        applicationPicture: app.applicationPicture,
        amountRequested: app.amountRequested,
        status: app.applicationStatus,
      }));
  
      res.json({
        applications: responseData,
      });
    } catch (error) {
      console.error("Error fetching approved applications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
 


export const unlockMilestone = async (req, res) => {
    try {
      const { userId, usageSummary, completionDate, thirdPartyVerification, breakdownFileHash } = req.body;
      const application = await Application.findOne({ userId, applicationStatus: "in progress" });
      if (!application) {
        return res.status(404).json({ message: "No active application found for this user." });
      }
      const activeBreakdownIndex = application.breakdowns.findIndex(b => b.breakdownStatus === "active");
      if (activeBreakdownIndex === -1) {
        return res.status(400).json({ message: "No active breakdown found." });
      }
      const breakdownId = application.breakdowns[activeBreakdownIndex]._id;
      const breakdownProof = new BreakdownProof({
        breakdownId,
        breakdownFileHash,
        usageSummary,
        completionDate,
        thirdPartyVerification,
      });
  
      await breakdownProof.save();
  
      application.breakdowns[activeBreakdownIndex].breakdownStatus = "completed";
  
      await application.save();
  
      return res.status(201).json({
        message: "Breakdown proof submitted successfully.",
        proof: breakdownProof
      });
    } catch (error) {
      console.error("Error submitting breakdown proof:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  
  
  };


export const getProgressReport = async (req, res) => {
  try {
    const { applicationId } = req.body;
    console.log("Application ID:", applicationId);

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const application = await Application.findById(applicationId)
      .select("deadline amountRequested description applicationTitle amountRaised applicationPicture breakdowns donations userId")
      .populate('userId', 'name email ethAddress role avatar');

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Calculate days left
    const daysLeft = Math.max(
      Math.ceil((new Date(application.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
      0
    );

    // Map breakdowns
    const breakdowns = application.breakdowns.map((breakdown) => ({
      id: breakdown._id,
      needId: breakdown.needId,
      purpose: breakdown.purpose,
      amount: breakdown.amount,
      breakdownStatus: breakdown.breakdownStatus,
      proof: breakdown.documentEncryption ? "Proof Available" : "No Proof",
    }));

    const activeBreakdown = application.breakdowns.find(
      (b) => b.breakdownStatus?.toLowerCase() === "active"
    );

    console.log("Active Breakdown Found:", activeBreakdown);

    const currentNeedId = activeBreakdown ? activeBreakdown.needId : null;

    // Map donations
    const donations = (application.donations || []).map((donation) => ({
      donorAddress: donation.donorAddress,
      amount: donation.amount,
      donatedAt: donation.donatedAt,
    }));

    res.json({
      user: {
        name: application.userId.name,
        email: application.userId.email,
        ethAddress: application.userId.ethAddress,
        role: application.userId.role,
        avatar: application.userId.avatar,
      },
      daysLeft,
      amountRaised: application.amountRaised,
      totalAmount: application.amountRequested,
      description: application.description,
      applicationTitle: application.applicationTitle,
      applicationPicture: application.applicationPicture,
      breakdowns,
      donations,
      currentNeedId, 
    });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getBreakdownProof = async (req, res) => {
    try {
      const { breakdownId } = req.body;
      console.log(breakdownId);
  
      if (!mongoose.Types.ObjectId.isValid(breakdownId)) {
        return res.status(400).json({ error: "Invalid breakdown ID" });
      }
  
      const breakdownProof = await BreakdownProof.findOne({ breakdownId });
  
      if (!breakdownProof) {
        return res.status(404).json({ error: "Breakdown proof not found" });
      }
  
      res.json({
        breakdownId: breakdownProof.breakdownId,
        proofStatus: breakdownProof.proofStatus,
        breakdownFileHash:breakdownProof.breakdownFileHash,
        proofDocumentEncryption: breakdownProof.proofDocumentEncryption
          ? "Proof Document Available"
          : "No Proof Document",
        usageSummary: breakdownProof.usageSummary,
        completionDate: breakdownProof.completionDate,
        thirdPartyVerification: breakdownProof.thirdPartyVerification,
        createdAt: breakdownProof.createdAt,
        updatedAt: breakdownProof.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching breakdown proof details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  



  

  export const unlockNeedId = async (req, res) => {
    try {
      const { userId } = req.body;
      const application = await Application.findOne({ userId, applicationStatus: "in progress" });
      if (!application) {
        return res.status(404).json({ message: "No active application found for this user." });
      }
      const activeBreakdownIndex = application.breakdowns.findIndex(b => b.breakdownStatus === "active");
      if (activeBreakdownIndex === -1) {
        return res.status(400).json({ message: "No active breakdown found." });
      }
      const activeBreakdown = application.breakdowns[activeBreakdownIndex];
      return res.status(200).json({
        message: "Active breakdown found.",
        needId: activeBreakdown.needId,
        breakdownId: activeBreakdown._id, 
      });
    } catch (error) {
      console.error("Error unlocking milestone:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  










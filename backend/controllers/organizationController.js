import mongoose from "mongoose";
import Application from "../models/Application.js";
import BreakdownProof from "../models/BreakdownProof.js";
import User from "../models/userModel.js";
import NFT from "../models/nftModel.js";
import Donor from "../models/donorModel.js";

// Get top 3 donors for the current month
export const getTopMonthlyDonors = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Aggregate top 3 donors based on amount donated this month
    const topDonors = await Donor.aggregate([
      // Unwind donation records
      { $unwind: "$donations" },

      // Match only donations within current month
      {
        $match: {
          "donations.donatedAt": {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },

      // Group by userId and sum the donations
      {
        $group: {
          _id: "$userId",
          totalDonatedThisMonth: { $sum: "$donations.amount" },
        },
      },

      // Sort by amount descending
      { $sort: { totalDonatedThisMonth: -1 } },

      // Limit to top 3
      { $limit: 3 },

      // Join with User collection to get name and ethAddress
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },

      // Flatten userInfo array
      { $unwind: "$userInfo" },

      // Project only necessary fields
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userInfo.name",
          ethAddress: "$userInfo.ethAddress",
          totalDonatedThisMonth: 1,
        },
      },
    ]);

    res.status(200).json({ topDonors });
  } catch (err) {
    console.error("Error fetching top donors:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStatistics = async (req, res) => {
  try {
    // Total applications received monthly
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const totalApplicationsMonthly = await Application.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    // Total applications with applicationStatus "in progress"
    const totalInProgressApplications = await Application.countDocuments({
      applicationStatus: "in progress",
    });

    // Total applications with applicationApproval "waiting"
    const totalWaitingApprovals = await Application.countDocuments({
      applicationApproval: "waiting",
    });

    // Total breakdown proofs with proofStatus "waiting"
    const totalWaitingProofs = await BreakdownProof.countDocuments({
      proofStatus: "waiting",
    });

    res.json({
      totalApplicationsMonthly,
      totalInProgressApplications,
      totalWaitingApprovals,
      totalWaitingProofs,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getWaitingApplications = async (req, res) => {
  try {
    // Fetch all applications with applicationApproval set to "waiting"
    const applications = await Application.find({ applicationApproval: "waiting" })
      .populate("userId") // Populate user details
      .exec();

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications with waiting approval:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserStatistics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    let totalDonors = new Array(12).fill(0);
    let totalBeneficiaries = new Array(12).fill(0);
    
    let last7DaysDonors = new Array(7).fill(0);
    let last7DaysBeneficiaries = new Array(7).fill(0);
    
    const today = new Date();
    const last7DaysStart = new Date();
    last7DaysStart.setDate(today.getDate() - 6); // Start of the last 7 days

    // Aggregate query to count users by role and month
    const monthlyCounts = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate query to count users in the last 7 days by weekday
    const weeklyCounts = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last7DaysStart },
        },
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1=Sunday, 7=Saturday
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Populate the monthly arrays
    monthlyCounts.forEach(({ _id, count }) => {
      if (_id.role === "donor") {
        totalDonors[_id.month - 1] = count; // Month index is 0-based
      } else if (_id.role === "beneficiary") {
        totalBeneficiaries[_id.month - 1] = count;
      }
    });

    // Populate the weekly arrays (adjusting to Monday=0, Sunday=6)
    weeklyCounts.forEach(({ _id, count }) => {
      let index = (_id.dayOfWeek + 5) % 7; // Convert Sunday=1 to last index
      if (_id.role === "donor") {
        last7DaysDonors[index] = count;
      } else if (_id.role === "beneficiary") {
        last7DaysBeneficiaries[index] = count;
      }
    });

    res.json({
      totalDonors,
      totalBeneficiaries,
      last7DaysDonors, // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
      last7DaysBeneficiaries, // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.body;
    
    if (!applicationId) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const application = await Application.findById(applicationId)
      .populate("userId", "name email district ethAddress") // Populate user details
      .exec();

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const updateApplicationApproval = async (req, res) => {
  try {
    console.log("req.body",req.body);
    const { applicationId, applicationApproval, campaignId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const validStatuses = ["yes", "no", "waiting"];
    if (!validStatuses.includes(applicationApproval)) {
      return res.status(400).json({ error: "Invalid application approval status" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.applicationApproval = applicationApproval;

    if (campaignId !== undefined) {
      application.campaignId = campaignId;
    }

    if (applicationApproval === "yes" && application.breakdowns.length > 0) {
      application.breakdowns[0].breakdownStatus = "active";
    }

    await application.save();

    res.json({ message: "Application approval updated successfully", application });
  } catch (error) {
    console.error("Error updating application approval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getWaitingBreakdownProofs = async (req, res) => {
  try {
    const breakdownProofs = await BreakdownProof.find({ proofStatus: "waiting" })
      
      .exec();

    res.status(200).json({ success: true, breakdownProofs });
  } catch (error) {
    console.error("Error fetching breakdown proofs with waiting status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getBreakdownProofById = async (req, res) => {
  try {
    const { breakdownProofId } = req.body;

    if (!breakdownProofId) {
      return res.status(400).json({ message: "Breakdown Proof ID is required" });
    }

    const breakdownProof = await BreakdownProof.findById(breakdownProofId).exec();

    if (!breakdownProof) {
      return res.status(404).json({ message: "Breakdown Proof not found" });
    }

    const application = await Application.findOne({
      "breakdowns._id": breakdownProof.breakdownId
    });

    if (!application) {
      return res.status(404).json({ message: "Associated application not found" });
    }

    // 3. Get the user to fetch ethAddress
    const user = await User.findById(application.userId);

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }
    const breakdown = application.breakdowns.find(
      (b) => b._id.toString() === breakdownProof.breakdownId.toString()
    );

    if (!breakdown) {
      return res.status(404).json({ message: "Breakdown not found in application" });
    }

    // 5. Return success response
    return res.status(200).json({
      success: true,
      breakdownProof,
      ethAddress: user.ethAddress,
      needId: breakdown.needId
    });
  } catch (error) {
    console.error("Error fetching breakdown proof:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProofStatus = async (req, res) => {
  try {
    const { userId, breakdownProofId, proofStatus } = req.body;

    if (!userId || !breakdownProofId || !proofStatus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the breakdown proof entry
    const breakdownProof = await BreakdownProof.findById(breakdownProofId);
    if (!breakdownProof) {
      return res.status(404).json({ message: "Breakdown proof not found" });
    }

    // Find the application that contains the corresponding breakdown
    const application = await Application.findOne({
      "breakdowns._id": breakdownProof.breakdownId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Find the breakdown inside the application
    const breakdowns = application.breakdowns;
    const currentBreakdownIndex = breakdowns.findIndex(
      (b) => b._id.toString() === breakdownProof.breakdownId.toString()
    );

    if (currentBreakdownIndex === -1) {
      return res.status(404).json({ message: "Breakdown not found" });
    }

    if (proofStatus === "rejected") {
      breakdowns[currentBreakdownIndex].breakdownStatus = "inactive";

      // Mark all remaining breakdowns as inactive
      breakdowns.forEach((b, index) => {
        if (index > currentBreakdownIndex) {
          b.breakdownStatus = "inactive";
        }
      });

      // Mark the application as rejected
      application.applicationStatus = "rejected";
      await application.save();

      return res.status(200).json({ success: true, message: "Proof rejected. Breakdown and application marked as inactive/rejected." });
    } 
    
    else if (proofStatus === "approved") {
      const isLastBreakdown = currentBreakdownIndex === breakdowns.length - 1;

      if (isLastBreakdown) {
        application.applicationStatus = "fulfilled";
      } else {
        breakdowns[currentBreakdownIndex + 1].breakdownStatus = "active";
      }

      await application.save();

      return res.status(200).json({
        success: true,
        message: isLastBreakdown
          ? "Proof approved. Application marked as fulfilled."
          : "Proof approved. Next breakdown activated.",
      });
    } 
    
    else {
      return res.status(400).json({ message: "Invalid proof status" });
    }
  } catch (error) {
    console.error("Error updating proof status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getApprovedApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicationApproval: "yes" })
      .populate("userId", "name email") // Populate user details
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: "No approved applications found" });
    }

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching approved applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateDonorNFT = async (req, res) => {
  try {
    console.log("req.body", req.body);
    let { tokenURI, ethAddress } = req.body;

    if (!tokenURI || !ethAddress) {
      return res.status(400).json({ message: "tokenURI and ethAddress are required." });
    }

    // Sanitize tokenURI:
    // Remove any leading/trailing quotes or whitespace
    tokenURI = tokenURI.trim().replace(/^'+|'+$/g, '').replace(/^"+|"+$/g, '');

    // Add https:// if missing
    if (!tokenURI.startsWith("http")) {
      tokenURI = `https://${tokenURI}`;
    }

    const response = await fetch(tokenURI);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const metadata = await response.json();
    const { name, description, image } = metadata;

    if (!name || !description || !image) {
      return res.status(400).json({ message: "Missing required fields in metadata." });
    }

    // Find user by ethAddress
    const user = await User.findOne({ ethAddress });
    if (!user) {
      return res.status(404).json({ message: "User with this ethAddress not found." });
    }

    // Get current date for award info
    const now = new Date();
    const awardedMonth = now.getUTCMonth() + 1;
    const awardedYear = now.getUTCFullYear();

    // Create and save NFT
    const newNFT = new NFT({
      donorId: user._id,
      metadataURI: tokenURI,
      awardedMonth,
      awardedYear,
      nftImage: image,
      nftName: name,
      nftDescription: description,
    });

    await newNFT.save();

    return res.status(201).json({
      message: "NFT awarded successfully from metadata.",
      nft: newNFT,
    });
  } catch (error) {
    console.error("Error awarding NFT from metadata:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};





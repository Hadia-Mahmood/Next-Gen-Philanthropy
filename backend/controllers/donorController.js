import Application from "../models/Application.js";
import mongoose from "mongoose";
import Donor from "../models/donorModel.js";
import NFT from "../models/nftModel.js";
import User from "../models/userModel.js"; 


export const donatedToCampaign = async (req, res) => {
  try {
    const { userId, campaignId, amount, timestamp, fulfilled } = req.body;
    console.log("fulfilled ",fulfilled);

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid userId or campaignId" });
    }

    const user = await User.findById(userId);
    if (!user || !user.ethAddress) {
      return res.status(404).json({ error: "User or ethAddress not found" });
    }

    const donorAddress = user.ethAddress;

    let donor = await Donor.findOne({ userId });

    if (!donor) {
      donor = new Donor({
        userId,
        donations: [],
        totalAmountDonated: 0,
        campaignsDonatedTo: 0,
        nftIds: [],
      });
    }

    const hasDonatedToCampaign = donor.donations.some(
      (donation) => donation.applicationId.toString() === campaignId
    );

    donor.donations.push({
      applicationId: campaignId,
      amount,
      donatedAt: timestamp || Date.now(),
    });

    donor.totalAmountDonated = Number(donor.totalAmountDonated) + Number(amount);

    if (!hasDonatedToCampaign) {
      donor.campaignsDonatedTo += 1;
    }

    await donor.save();

    const application = await Application.findById(campaignId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.amountRaised = Number(application.amountRaised || 0) + Number(amount);

    application.donations.push({
      donorAddress,
      amount,
      donatedAt: timestamp || Date.now(),
    });

    if (fulfilled === true) {
      const activeBreakdownIndex = application.breakdowns.findIndex(
        (b) => b.breakdownStatus?.toLowerCase() === "active"
      );

      if (activeBreakdownIndex !== -1) {
        application.breakdowns[activeBreakdownIndex].breakdownStatus = "fulfilled";
        console.log("Breakdown marked as fulfilled:", application.breakdowns[activeBreakdownIndex]);
      } else {
        console.warn("No active breakdown found to mark as fulfilled.");
      }
    }

    await application.save();

    res.status(200).json({
      message: "Donation recorded successfully",
      donorSummary: {
        userId: donor.userId,
        totalAmountDonated: donor.totalAmountDonated,
        campaignsDonatedTo: donor.campaignsDonatedTo,
        recentDonation: {
          campaignId,
          amount,
          donorAddress,
          timestamp,
        },
      },
    });
  } catch (error) {
    console.error("Error recording donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const getDonationStatistics = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "donorId is required" });
    }

    const currentYear = new Date().getFullYear();
    let monthlyDonations = new Array(12).fill(0);
    let weeklyDonations = new Array(7).fill(0);

    const today = new Date();
    const last7DaysStart = new Date();
    last7DaysStart.setDate(today.getDate() - 6);
    const donor = await Donor.findOne({ userId });

    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    donor.donations.forEach((donation) => {
      const donatedDate = new Date(donation.donatedAt);

      // Monthly aggregation (current year)
      if (donatedDate.getFullYear() === currentYear) {
        const month = donatedDate.getMonth(); // 0 = Jan
        monthlyDonations[month] += donation.amount;
      }

      // Weekly aggregation (last 7 days)
      if (donatedDate >= last7DaysStart && donatedDate <= today) {
        const day = (donatedDate.getDay() + 6) % 7; // 0 = Monday
        weeklyDonations[day] += donation.amount;
      }
    });

    res.json({
      userId,
      monthlyDonations,  // [Jan, Feb, ..., Dec]
      weeklyDonations    // [Mon, Tue, ..., Sun]
    });
  } catch (error) {
    console.error("Error fetching donation statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getDonorData = async (req, res) => { 
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch donor info
    const donor = await Donor.findOne({ userId }).populate("nftIds");

    if (!donor) {
      return res.status(404).json({ error: "Donor not found." });
    }

    let lastContributedDate = null;
    if (donor.donations.length > 0) {
      const sorted = donor.donations.sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt));
      const latest = sorted[0].donatedAt;

      lastContributedDate = new Date(latest).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Round off totalAmountDonated
    const roundedTotalAmount = parseFloat(donor.totalAmountDonated.toFixed(2));

    return res.status(200).json({
      totalAmountDonated: roundedTotalAmount,
      campaignsDonatedTo: donor.campaignsDonatedTo,
      nftCount: donor.nftIds.length,
      lastContributedDate,
    });
  } catch (error) {
    console.error("Error in getDonorStats:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getNFTsByUserId = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const nfts = await NFT.find({ donorId: userId });

    if (!nfts || nfts.length === 0) {
      return res.status(404).json({ message: "No NFTs found for this user." });
    }

    return res.status(200).json({
      message: "NFTs retrieved successfully.",
      nfts,
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const getDonorApplications = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find the donor
    const donor = await Donor.findOne({ userId });
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Extract applicationIds from donor's donation records
    const applicationIds = donor.donations.map(d => d.applicationId);

    // Get the applications using the IDs
    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate("userId", "name email") // Populate beneficiary name and email
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: "No applications found for this donor" });
    }

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching donor applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import express from "express";
const router = express.Router();

import { userAuth } from "../middleware/userAuth.js";

import { checkRole } from "../middleware/checkRole.js";


import {
   
    donatedToCampaign,
    getDonationStatistics,
    getDonorData,
    getNFTsByUserId,
    getDonorApplications
    
   
} from "../controllers/donorController.js";

router.post("/donatedCampaigns", userAuth, async (req, res) => {
    getDonorApplications(req, res);
});
router.post("/donatedToCampaign",userAuth,  async (req, res) => {
    donatedToCampaign(req, res);
});
router.post("/getDonorData",userAuth,  async (req, res) => {
    getDonorData(req, res);
});


router.post("/userCollection", userAuth, async (req, res) => {
    getNFTsByUserId(req, res);
});
router.post("/donationStatistics", userAuth, async (req, res) => {
    getDonationStatistics(req, res);
});
export default router;

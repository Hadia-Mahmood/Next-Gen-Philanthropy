import express from "express";
const router = express.Router();

import { userAuth } from "../middleware/userAuth.js";

import { checkRole } from "../middleware/checkRole.js";


import {
    getStatistics,
    getUserStatistics,
    getWaitingApplications,
    getApplicationById,
    updateApplicationApproval,
    getWaitingBreakdownProofs,
    getBreakdownProofById,
    updateProofStatus,
    getApprovedApplications,
    getTopMonthlyDonors,
    updateDonorNFT,
} from "../controllers/organizationController.js";

router.get("/get-top-donors",  async (req, res) => {
  getTopMonthlyDonors(req, res);
});


router.get("/get-organization-statistics", userAuth, async (req, res) => {
    getStatistics(req, res);
  });

  
router.get("/get-user-statistics",  userAuth,async (req, res) => {
  getUserStatistics(req, res);
  });

router.get("/get-waiting-application",userAuth,  async (req, res) => {
  getWaitingApplications(req, res);
    });

router.post("/getApplicationById", userAuth, async (req, res) => {
  getApplicationById(req, res);
});

router.post("/updateApplicationApproval", userAuth, async (req, res) => {
  updateApplicationApproval(req, res);
});



router.get("/get-waiting-breakdown-proof", userAuth, async (req, res) => {
  getWaitingBreakdownProofs(req, res);
    });

    
router.post("/getBreakdownProofById", userAuth, async (req, res) => {
  getBreakdownProofById(req, res);
    });

router.post("/updateProofStatus", userAuth, async (req, res) => {
           updateProofStatus(req, res);
    });

router.get("/get-approved-application", userAuth, async (req, res) => {
          getApprovedApplications(req, res);
             });

router.post("/updateDonorNFT", userAuth, async (req, res) => {
           updateDonorNFT(req, res);
    });
export default router;

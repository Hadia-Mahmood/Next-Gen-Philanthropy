import express from "express";
const router = express.Router();

import { userAuth } from "../middleware/userAuth.js";

import { checkRole } from "../middleware/checkRole.js";

 
import {
    getApplicationData,
    getAllApplicationData,
    createApplication,
    unlockMilestone,
    getProgressReport,
    getBreakdownProof,
    unlockNeedId,
  } from "../controllers/beneficiaryController.js";
import {
  uploadBreakdownDonationProof,
} from "../controllers/breadkdownProofController.js"

router.post("/unlock-need-id", userAuth, async (req, res) => {
  unlockNeedId(req, res);
});

router.post("/create-beneficiary-application",userAuth,  async (req, res) => {
    createApplication(req, res);
  });


router.post("/upload-donation-proof",userAuth,  async (req, res) => {
  uploadBreakdownDonationProof(req, res);
});


router.post("/getApplicationData", userAuth, async (req, res) => {
  getApplicationData(req, res);
});


router.post("/getAllApplicationData", userAuth, async (req, res) => {
  getAllApplicationData(req, res);
});

router.post("/unlock-milestone", userAuth, async (req, res) => {
  unlockMilestone(req, res);
});

router.post("/getProgressReport",userAuth,  async (req, res) => {
  getProgressReport(req, res);
});


router.post("/getBreakdownProof", userAuth, async (req, res) => {
  getBreakdownProof(req, res);
});

export default router;

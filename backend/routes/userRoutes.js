import express from "express";
const router = express.Router();


import { userAuth } from "../middleware/userAuth.js";

import { checkRole } from "../middleware/checkRole.js";
import {
  userLogin,
  UserSignup,
  getUserID,
  getAllUsers,
  forgotPassword, 
  resetPassword,
  getUserEthAddress,
  getActiveApprovedApplications,
} from "../controllers/authController.js";

router.post("/register-user", (req, res) => {
  UserSignup(req.body , res);
});

router.post("/get-eth-address",userAuth, (req, res) => {
  getUserEthAddress(req , res);
});


router.post("/forgotPassword", async (req, res) => {
  forgotPassword(req, res);
});

router.post("/resetPassword", async (req, res) => {
  resetPassword(req, res);
});
router.post("/Login", async (req, res) => {
  await userLogin(req.body, res);
});

router.get("/se-protected", userAuth, checkRole(["user"]), async (req, res) => {
  return res.json(`welcome ${req.body.name}`);
});

router.get("/get-UserId", userAuth, async (req, res) => {
  getUserID(req, res);
});

router.get("/get-all-users", userAuth, async (req, res) => {
  getAllUsers(req, res);
});

router.get("/get-all-approved-application", async (req, res) => {
  getActiveApprovedApplications(req, res);
});



export default router;

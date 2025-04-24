import mongoose from "mongoose";
import Application from "../models/Application.js";
import BreakdownProof from "../models/BreakdownProof.js";
import UserModel from "../models/userModel.js";

import {PINATA_APIKEY,PINATA_SECRETKEY} from "../config/pinataConfig.js";
import pinataSDK from "@pinata/sdk";
import {generateEncryptionKey} from "../utils/generateKey.js";
import {encryptFile} from "../utils/encryption.js";

export const uploadImage = async (req, res) => {
  try {
    
    const userAddress = "0xa2c8345b30B4c26e118F307269dE96913DbdB4bC";
    const user=await UserModel.findOne({ethAddress:userAddress})
        if(!user){
            throw new Error("User does not exist")
        }
    console.log("inside upload");
    console.log("joking", req.body.data.image);
    
    if (!PINATA_APIKEY || !PINATA_SECRETKEY) {
      throw new Error("Pinata API keys are missing!");
    }

    console.log("required pinata sdk");
    
    const pinata = new pinataSDK(PINATA_APIKEY, PINATA_SECRETKEY);
    console.log("got keys");

    const response = await pinata.testAuthentication();
    console.log("authenticated");
    console.log(response);

    res.status(200).json({ message: "Authentication successful", response });
  } catch (error) {
    console.error("Error in uploadUserImage:", error.message || error);
    res.status(500).json({ error: "Failed to authenticate with Pinata", details: error.message });
  }
};

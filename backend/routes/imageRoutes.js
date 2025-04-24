import express from "express";
const router = express.Router();


import {
    
    uploadImage,
} from "../controllers/uploadImageController.js";


import {uploadUserImage} from "../middleware/multer.js";

router.post("/uploadImage", uploadUserImage, async (req, res) => {
    uploadImage(req, res);
             });

export default router;

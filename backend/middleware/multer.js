import multer from "multer";

const storage = multer.memoryStorage(); // Store file data in memory

export const uploadUserImage = multer({ storage }).single("file");

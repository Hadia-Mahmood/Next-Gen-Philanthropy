import crypto from "crypto";

// Function to generate a secure encryption key
export const generateEncryptionKey = (length) => {
  return crypto.randomBytes(length / 2).toString("hex"); // Generate random bytes and convert to hexadecimal string
};

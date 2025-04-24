import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
 
    metadataURI: {
      type: String, // URI pointing to NFT metadata (stored on IPFS )
    },
    awardedMonth: {
      type: Number,
      required: true, // The month in which the donor was awarded the NFT
    },
    awardedYear: {
      type: Number,
      required: true, // The year in which the donor was awarded the NFT
    },
    nftImage: {
      type: String, // Direct link to the NFT image for UI display "https://ipfs.io/ipfs/QmNFTImage",
    },
    nftName: {
      type: String, // Name of the NFT (e.g., "Top Donor of June 2024")
    },
    nftDescription: {
      type: String, // Short description of the NFT reward
    },
  },
  { timestamps: true }
);

export default mongoose.model("NFT", NFTSchema);

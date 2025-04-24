import { ethers } from "ethers";
import { smartContract } from "../constants/nftConstants";
 
let provider;
let signer;
let CharityNFTContract;

if (typeof window !== "undefined") {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  if (ethers.utils.isAddress(smartContract.address)) {
    CharityNFTContract = new ethers.Contract(
        smartContract.address,
        smartContract.abi,
      signer
    );
    console.log("✅ CharityNFT Contract address is valid.");
  } else {
    console.error("❌ Invalid CharityNFT contract address:", smartContract.address);
  }
}

class CharityNFTContractInteraction {
  // Helper method for transaction processing
  static async processTransaction(txPromise) {
    const tx = await txPromise;
    const receipt = await tx.wait();

    if (receipt.status === 0) {
      throw new Error("Transaction was cancelled.");
    }

    return tx;
  }

  // Owner functions
  static async updateTopDonors(topDonors) {
    return this.processTransaction(
      CharityNFTContract.updateTopDonors(topDonors)
    );
  }

  static async awardTopDonorsNFTs() {
    return this.processTransaction(
      CharityNFTContract.awardTopDonorsNFTs()
    );
  }

  // View functions
  static async getCurrentMetadataSet() {
    return CharityNFTContract.getCurrentMetadataSet();
  }

  static async getTopDonors() {
    return CharityNFTContract.getTopDonors();
  }

  static async lastRewardTimestamp() {
    return CharityNFTContract.lastRewardTimestamp();
  }

  static async balanceOf(ownerAddress) {
    return CharityNFTContract.balanceOf(ownerAddress);
  }

  static async ownerOf(tokenId) {
    return CharityNFTContract.ownerOf(tokenId);
  }

  static async tokenURI(tokenId) {
    return CharityNFTContract.tokenURI(tokenId);
  }

  // Additional helper functions
  static async isOwner(address) {
    return CharityNFTContract.owner() === address;
  }
}

export default CharityNFTContractInteraction;
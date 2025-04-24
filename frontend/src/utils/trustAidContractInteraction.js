import { ethers } from "ethers";

import { smartContract } from "../constants/trustAidConstants";
let provider;
let signer;
let TrustAidContract;
 
if (typeof window !== "undefined") {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  if (ethers.utils.isAddress(smartContract.address)) {
  TrustAidContract = new ethers.Contract(
    smartContract.address,
    smartContract.abi,
    signer
  );
    console.log("✅ Contract address is valid.");
  } else {
    console.error("❌ Invalid contract address:", smartContract.address);
  }
}


class TrustAidContractInteraction {
  // Helper method for transaction processing
  static async processTransaction(txPromise) {
    const tx = await txPromise;
    const receipt = await tx.wait();

    if (receipt.status === 0) {
      throw new Error("Transaction was cancelled.");
    }

    return tx;
  }

  // Admin functions
  static async approveCampaign(beneficiaryAddress) {
    return this.processTransaction(
      TrustAidContract.approveCampaign(beneficiaryAddress)
    );
  }

  static async disapproveCampaign(beneficiaryAddress) {
    return this.processTransaction(
      TrustAidContract.disapproveCampaign(beneficiaryAddress)
    );
  }

  static async banBeneficiary(beneficiaryAddress) {
    return this.processTransaction(
      TrustAidContract.banBeneficiary(beneficiaryAddress)
    );
  }
  
  static async unbanBeneficiary(beneficiaryAddress) {
    return this.processTransaction(
      TrustAidContract.unbanBeneficiary(beneficiaryAddress)
    );
  }

  static async transferOwnership(newOwnerAddress) {
    return this.processTransaction(
      TrustAidContract.transferOwnership(newOwnerAddress)
    );
  }

  // Beneficiary functions
 
  static async submitNeeds(beneficiary, descriptions, amountsInETH, documentsIpfsHashes) {
    return this.processTransaction(
      TrustAidContract.submitNeeds(
        beneficiary,
        descriptions, 
        amountsInETH,
        documentsIpfsHashes
      )
    );
  }
  static async submitProof(beneficiary,needId, proofIpfsHashes) {
    return this.processTransaction(
      TrustAidContract.submitProof(beneficiary, needId, proofIpfsHashes)
    );
  }
 
  // Donor functions
  static async donate(beneficiaryAddress, needId, amountInETH) {
    const value = ethers.utils.parseEther(amountInETH.toString());
    return this.processTransaction(
      TrustAidContract.donate(beneficiaryAddress, needId, { value })
    );
  }

  // Admin verification functions
  static async approveProof(beneficiaryAddress, needId) {
    return this.processTransaction(
      TrustAidContract.approveProof(beneficiaryAddress, needId)
    );
  }

  static async rejectProof(beneficiaryAddress, needId) {
    return this.processTransaction(
      TrustAidContract.rejectProof(beneficiaryAddress, needId)
    );
  }

  static async refundExcess(beneficiaryAddress, needId) {
    return this.processTransaction(
      TrustAidContract.refundExcess(beneficiaryAddress, needId)
    );
  }

  // View functions
  static async getBeneficiaryNeeds(beneficiaryAddress) {
    return TrustAidContract.getBeneficiaryNeeds(beneficiaryAddress);
  }

  static async getBalance(accountAddress) {
    return TrustAidContract.getBalance(accountAddress);
  }

  static async getNeedDonors(beneficiaryAddress, needIndex) {
    return TrustAidContract.getNeedDonors(beneficiaryAddress, needIndex);
  }
 
  static async remainingDonation(beneficiaryAddress, needId) {
    return TrustAidContract.remainingDonation(beneficiaryAddress, needId);
  }

  static async getDonorCampaignIdsAndAmounts(donorAddress) {
    return TrustAidContract.getDonorCampaignIdsAndAmounts(donorAddress);
  }

  static async getFulfilledNeedsCount(beneficiaryAddress) {
    return TrustAidContract.getFulfilledNeedsCount(beneficiaryAddress);
  }

  static async getAllCampaignIds(beneficiaryAddress) {
    return TrustAidContract.getAllCampaignIds(beneficiaryAddress);
  }

  static async getCampaignById(campaignId) {
    return TrustAidContract.getCampaignById( campaignId);
  }


  static async getCurrentNeedDonationAmount(beneficiaryAddress) {
    return TrustAidContract.getCurrentNeedDonationAmount(beneficiaryAddress);
  }

  // static async createCampaign(beneficiaryAddress) {
  //   return this.processTransaction(
  //     TrustAidContract.createCampaign(beneficiaryAddress)
  //   );
  // }

  // Additional helper functions
  static async getTotalFunds() {
    return TrustAidContract.totalFunds();
  }

  static async isBeneficiaryApproved(beneficiaryAddress) {
    return TrustAidContract.beneficiaries(beneficiaryAddress).approved;
  }

  static async isBeneficiaryBanned(beneficiaryAddress) {
    return TrustAidContract.bannedBeneficiaries(beneficiaryAddress);
  }
}

export default TrustAidContractInteraction;











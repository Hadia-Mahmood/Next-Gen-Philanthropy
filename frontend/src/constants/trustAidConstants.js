export const smartContract = {
   
	
	address: "0xC079628f6DEdd92326c9D44A5F83a3E5ECbC50C1",
	abi:[
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "approveCampaign",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needId",
					"type": "uint256"
				}
			],
			"name": "approveProof",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "banBeneficiary",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				}
			],
			"name": "BeneficiaryApproved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				}
			],
			"name": "BeneficiaryBanned",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				}
			],
			"name": "BeneficiaryUnbanned",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "campaignId",
					"type": "uint256"
				}
			],
			"name": "CampaignCreated",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "disapproveCampaign",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needId",
					"type": "uint256"
				}
			],
			"name": "donate",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "needId",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "excessInETH",
					"type": "uint256"
				}
			],
			"name": "ExcessFundsAllocated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "donor",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "needId",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "ExcessFundsRefunded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amountInETH",
					"type": "uint256"
				}
			],
			"name": "FundReleased",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "donor",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amountInETH",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "timestamp",
					"type": "uint256"
				}
			],
			"name": "FundsDonated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "needId",
					"type": "uint256"
				}
			],
			"name": "ProofApproved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "needId",
					"type": "uint256"
				}
			],
			"name": "ProofRejected",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "needId",
					"type": "uint256"
				}
			],
			"name": "ProofSubmitted",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needId",
					"type": "uint256"
				}
			],
			"name": "refundExcess",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needId",
					"type": "uint256"
				}
			],
			"name": "rejectProof",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "string[]",
					"name": "_descriptions",
					"type": "string[]"
				},
				{
					"internalType": "uint256[]",
					"name": "_amountsInETH",
					"type": "uint256[]"
				},
				{
					"internalType": "string[][]",
					"name": "_documentsIpfsHashes",
					"type": "string[][]"
				}
			],
			"name": "submitNeeds",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needId",
					"type": "uint256"
				},
				{
					"internalType": "string[]",
					"name": "_proofIpfsHashes",
					"type": "string[]"
				}
			],
			"name": "submitProof",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "unbanBeneficiary",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "admin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "allocatedExcessFunds",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "bannedBeneficiaries",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "beneficiaries",
			"outputs": [
				{
					"internalType": "address",
					"name": "wallet",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "currentNeedIndex",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "approved",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "campaignCounter",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "campaignIdToBeneficiary",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "campaigns",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "campaignId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "totalRaised",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "totalRequired",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "active",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "currentNeedIndex",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "donations",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "donorCampaignIds",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "donorDonatedToCampaign",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "donors",
			"outputs": [
				{
					"internalType": "address",
					"name": "wallet",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "totalDonated",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "excessDonations",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "getAllCampaignIds",
			"outputs": [
				{
					"internalType": "uint256[]",
					"name": "",
					"type": "uint256[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_account",
					"type": "address"
				}
			],
			"name": "getBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "getBeneficiaryNeeds",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id",
							"type": "uint256"
						},
						{
							"internalType": "string",
							"name": "description",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "amountInETH",
							"type": "uint256"
						},
						{
							"internalType": "bool",
							"name": "fulfilled",
							"type": "bool"
						},
						{
							"internalType": "bool",
							"name": "proofSubmitted",
							"type": "bool"
						},
						{
							"internalType": "bool",
							"name": "proofApproved",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "fulfilledTimestamp",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "amountFulfilledInETH",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "excess",
							"type": "uint256"
						},
						{
							"internalType": "string[]",
							"name": "proofIpfsHashes",
							"type": "string[]"
						},
						{
							"internalType": "string[]",
							"name": "needDocumentsIpfsHashes",
							"type": "string[]"
						}
					],
					"internalType": "struct TrustAid.Need[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_campaignId",
					"type": "uint256"
				}
			],
			"name": "getCampaignById",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "campaignId",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "beneficiary",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "totalRaised",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "totalRequired",
							"type": "uint256"
						},
						{
							"internalType": "bool",
							"name": "active",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "currentNeedIndex",
							"type": "uint256"
						},
						{
							"components": [
								{
									"internalType": "uint256",
									"name": "id",
									"type": "uint256"
								},
								{
									"internalType": "string",
									"name": "description",
									"type": "string"
								},
								{
									"internalType": "uint256",
									"name": "amountInETH",
									"type": "uint256"
								},
								{
									"internalType": "bool",
									"name": "fulfilled",
									"type": "bool"
								},
								{
									"internalType": "bool",
									"name": "proofSubmitted",
									"type": "bool"
								},
								{
									"internalType": "bool",
									"name": "proofApproved",
									"type": "bool"
								},
								{
									"internalType": "uint256",
									"name": "fulfilledTimestamp",
									"type": "uint256"
								},
								{
									"internalType": "uint256",
									"name": "amountFulfilledInETH",
									"type": "uint256"
								},
								{
									"internalType": "uint256",
									"name": "excess",
									"type": "uint256"
								},
								{
									"internalType": "string[]",
									"name": "proofIpfsHashes",
									"type": "string[]"
								},
								{
									"internalType": "string[]",
									"name": "needDocumentsIpfsHashes",
									"type": "string[]"
								}
							],
							"internalType": "struct TrustAid.Need[]",
							"name": "needs",
							"type": "tuple[]"
						}
					],
					"internalType": "struct TrustAid.Campaign",
					"name": "campaign",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "getCurrentNeedDonationAmount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_donor",
					"type": "address"
				}
			],
			"name": "getDonorCampaignIdsAndAmounts",
			"outputs": [
				{
					"internalType": "uint256[]",
					"name": "campaignIds",
					"type": "uint256[]"
				},
				{
					"internalType": "uint256[]",
					"name": "donationAmounts",
					"type": "uint256[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				}
			],
			"name": "getFulfilledNeedsCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "count",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needIndex",
					"type": "uint256"
				}
			],
			"name": "getNeedDonors",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "needDonors",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "pastCampaigns",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "campaignId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "totalRaised",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "totalRequired",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "active",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "currentNeedIndex",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_beneficiary",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_needId",
					"type": "uint256"
				}
			],
			"name": "remainingDonation",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "remaining",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "totalFunds",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
  };
  
   
"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import styles from "./processProofs.module.css";
import { useGetWaitingBreakdownProof } from "@/hooks/organization-hook";
import Link from "next/link";



const ProcessProofs = () => {
  
  const {
    data: breakdownProofData,
    isLoading,
    error,
  } = useGetWaitingBreakdownProof();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const breakdownProofs = breakdownProofData?.breakdownProofs || [];
  console.log(breakdownProofs);
  return (
    <div className="w-full bg-[#f7f9f8] min-h-screen pt-10 md:pt-8 pb-5 md:pb-10 px-3 md:px-10">
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-5 mb-16 lg:w-2/4 mx-auto text-left lg:text-center text-[#182822] leading-normal">
        Process Proofs
      </h1> 
 
      <div className={styles.campaignContainer}>
        {breakdownProofs.length > 0 ? (
          breakdownProofs.map((proof) => (
           
            <div key={proof._id} className={styles.campaignCard}>
              
            <iframe 
               src={`${proof.breakdownFileHash}`} 
               className={styles.campaignImage}
            ></iframe>
            
              <div className={styles.content}>
                {/* <h1>{proof.thirdPartyVerification.name}</h1>
                 */}
                <p>
                  <strong>Usage Summary:</strong> {proof.usageSummary}
                </p>
                <p>
                  <strong>Completion Date:</strong>{" "}
                  {new Date(proof.completionDate).toLocaleDateString()}
                </p>

                <button
                
                className={styles.viewButton}
              >
                <Link
                    href={`/dashboard/organization/approve-proof?breakdownProofId=${proof._id}`}
                    
                  >
                     Process
                 </Link>
                 
                <span className={styles.arrowIcon}>
                  <IoIosArrowRoundForward />
                </span>
              </button>
              </div>
            </div>
          ))
        ) : (
          <p>No waiting proofs found.</p>
        )}
      </div>
    </div>
  );
};

export default ProcessProofs;


"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import styles from "./CampaignFills.module.css";
import { useRouter } from "next/navigation";
import { useGetApprovedApplications } from "@/hooks/auth-hook";
import Link from "next/link";

const CampaignFills = () => {
  const {
    data: applicationData,
    isLoading: applicationLoading,
    error: applicationError,
  } = useGetApprovedApplications();

  if (applicationLoading) return <div>Loading...</div>;
  if (applicationError) return <div>Error: {applicationError.message}</div>;
  const applications = applicationData?.applications || [];
  console.log(applications);

  const router = useRouter();
 

  return (
    <div className="w-full bg-[#f7f9f8] min-h-screen pt-16 md:pt-32 pb-10 md:pb-20 px-3 md:px-10">
      <h6 className="text-center font-bold text-[#f29620]">
        Safe And Trusted Fund Collection And Distribution
      </h6>
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-5 mb-16 lg:w-2/4 mx-auto text-left lg:text-center text-[#182822] leading-normal">
        Devoted & Trustworthy Fund Collection And Distribution
      </h1>
      <div className={styles.campaignContainer}>
        {applications.map((application) => (
          <div key={application._id} className={styles.campaignCard}>
            <img
              src={application.applicationPicture?.url || "/default-image.jpg"}
              alt={application.name}
              className={styles.campaignImage}
            />
            <div className={styles.content}>
            <h1>{application.applicationTitle}</h1>
             
              <div className={styles.campaignDetails}>
 
                <p><strong>Description:</strong> {application.description}</p>
                <p><strong>Name:</strong> {application.userId?.name || "N/A"}</p>
                <p><strong>Target Amount:</strong> ${application.amountRequested}</p>
                <p><strong>Deadline:</strong> {new Date(application.deadline).toLocaleDateString()}</p>
              
               
              </div>
              <button
 
>
<Link href={`/find-beneficiary/specific/${application._id}`}>
  <button className={styles.viewButton}>
    Details
    <span className={styles.arrowIcon}>
      <IoIosArrowRoundForward />
    </span>
  </button>
</Link>

                 
  
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CampaignFills;

"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import styles from "./Contributions.module.css";
 
import Link from "next/link";
import { useStateContext } from "@/app/StateContext";

import { useGetDonorCampaigns } from "@/hooks/donor-hook";

const AllContributions = () => {
  const router = useRouter();
  
  const { user } = useStateContext();
  const {
    data: applicationData,
    isLoading: applicationLoading,
    error: applicationError,
  } = useGetDonorCampaigns(user?.userId);

  if (applicationLoading) return <div>Loading...</div>;
  if (applicationError) return <div>Error: {applicationError.message}</div>;

  const applications = applicationData?.applications || [];

  return (
    <div className="w-full bg-[#f7f9f8] min-h-screen pt-10 md:pt-8 pb-5 md:pb-10 px-3 md:px-10">
      
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-5 mb-16 lg:w-2/4 mx-auto text-left lg:text-center text-[#182822] leading-normal">
       My Contributions
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
             
              <p><strong>Description:</strong> {application.description}</p>
              <p><strong>Name:</strong> {application.userId?.name || "N/A"}</p>
              <p><strong>Target Amount:</strong> ${application.amountRequested}</p>
              <p><strong>Deadline:</strong> {new Date(application.deadline).toLocaleDateString()}</p>
              
              <button  
                 
                className={styles.viewButton}
              > 
                <Link
                    href={`/dashboard/donor/donation-report?applicationId=${application._id}`}
                  >
                      Details
                 </Link>
                 
                <span className={styles.arrowIcon}>
                  <IoIosArrowRoundForward />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllContributions;


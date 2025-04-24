"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import styles from "./processApplication.module.css";
import { useGetApprovedApplications } from "@/hooks/organization-hook";
import Link from "next/link";
 
const ApprovedApplications = () => {
  const {
    data: applicationData,
    isLoading: applicationLoading,
    error: applicationError,
  } = useGetApprovedApplications();

  if (applicationLoading) return <div>Loading...</div>;
  if (applicationError) return <div>Error: {applicationError.message}</div>;

  // Ensure that applications exist before using them
  const applications = applicationData?.applications || [];

  const router = useRouter();
  
  return (
    <div className="w-full bg-[#f7f9f8] min-h-screen pt-10 md:pt-8 pb-5 md:pb-10 px-3 md:px-10">
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-5 mb-16 lg:w-2/4 mx-auto text-left lg:text-center text-[#182822] leading-normal">
        TraceAid Approved  Applications
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
                    href={`/dashboard/organization/progress-report?applicationId=${application._id}`}
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
export default ApprovedApplications;


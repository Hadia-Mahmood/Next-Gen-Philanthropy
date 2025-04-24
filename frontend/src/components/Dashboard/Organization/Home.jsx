"use client";
import dynamic from "next/dynamic";
import { IoEyeOutline } from "react-icons/io5";
import { CgShoppingCart } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { BsPeople } from "react-icons/bs";
import { useStateContext } from "@/app/StateContext";
import CardDataStats from "./CardDataStats";

import { useGetOrganizationStatistics } from "../../../hooks/organization-hook"; 

const ChartOne = dynamic(() => import("./ChartOne"), {
  ssr: false,
});

const ChartTwo = dynamic(() => import("./ChartTwo"), {
  ssr: false,
});



export const Home = () => {
  const {
    data: organizationData,
    isLoading: organizationLoading,
    error: organizationError,
  } = useGetOrganizationStatistics();

 

  const totalApplicationsMonthly = organizationData?.totalApplicationsMonthly ||0;
  const totalInProgressApplications = organizationData?.totalInProgressApplications|| 0;
  const totalWaitingApprovals = organizationData?.totalWaitingApprovals|| 0;
  const totalWaitingProofs =organizationData?.totalWaitingProofs|| 0;

  if (organizationLoading) return <div>Loading...</div>;
  if (organizationError) return <div className="text-red-500">No data found.</div>;
  
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7 ">
        <CardDataStats
          title="Total Cases Received"
          total={totalApplicationsMonthly + " Monthly"}
          rate=""
          levelUp
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <IoEyeOutline className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Active Cases"
          total={totalInProgressApplications}
          rate=""
          levelUp
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <CgShoppingCart className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Pending applications"
          total={totalWaitingApprovals}
          rate=""
          levelUp
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <FiShoppingBag className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Proofs Awaiting Verificaton"
          total={totalWaitingProofs}
          rate=""
          levelDown
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <BsPeople className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7 2xl:gap-7">
        <ChartOne />
        <ChartTwo />
         
       
      </div>
    </div>
  );
};

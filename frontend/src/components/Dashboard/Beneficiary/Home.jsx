"use client";
import dynamic from "next/dynamic";
import { IoEyeOutline } from "react-icons/io5";
import { CgShoppingCart } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { BsPeople } from "react-icons/bs";
import { useStateContext } from "@/app/StateContext";
import CardDataStats from "./CardDataStats";
import { useGetApplicationData } from "../../../hooks/beneficiary-hook"; 

export const Home = () => {
  const { user } = useStateContext();
  console.log(user?.userId);

  const {
    data: applicationData,
    isLoading: applicationLoading,
    error: applicationError,
  } = useGetApplicationData(user?.userId); 

  // Ensure default values if data is missing
  const totalAmountRequired = applicationData?.totalAmountRequired || 0;
  const isApproved = applicationData?.isApproved || 0;
  const daysLeft = applicationData?.daysLeft || 0;
  const totalBreakdowns = applicationData?.totalBreakdowns || 0;

  if (applicationLoading) return <div>Loading...</div>;
  if (applicationError) return <div className="text-red-500">No active application.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7 ">
        <CardDataStats title="Total Amount Required" total={totalAmountRequired} rate="" levelUp>
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <IoEyeOutline className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats title="Application Approval " total={isApproved} rate="" levelUp>
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <CgShoppingCart className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats title="Days Left" total={daysLeft} rate="" levelUp>
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <FiShoppingBag className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats title="Total Milestones" total={totalBreakdowns} rate="" levelDown>
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <BsPeople className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7 2xl:gap-7">
        <div className="col-span-12 bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Strict Rules and Regulations</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>All information provided in applications must be accurate and truthful.</li>
            <li>Supporting documents must be authentic and verifiable.</li>
            <li>Funds must only be used for the specified purposes in the aid application breakdown.</li>
            <li>Proof of fund usage must be submitted within the designated timeframe.</li>
            <li>Failure to comply with the rules will result in blacklisting and legal action.</li>
            <li>Fraudulent behavior, such as submitting false documents, is strictly prohibited.</li>
            <li>The organization reserves the right to audit fund usage and application details at any time.</li>
            <li>New donation requests can only be made after completing the current one.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

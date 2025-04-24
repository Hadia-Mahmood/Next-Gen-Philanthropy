"use client";
import dynamic from "next/dynamic";
import { IoEyeOutline } from "react-icons/io5";
import { CgShoppingCart } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { BsPeople } from "react-icons/bs";
import { useStateContext } from "@/app/StateContext";
import CardDataStats from "./CardDataStats";
import {
  useGetDonorData,
} from "../../../hooks/donor-hook"; 

const ChartOne = dynamic(() => import("./ChartOne"), {
  ssr: false,
});

const ChartTwo = dynamic(() => import("./ChartTwo"), {
  ssr: false,
});
 

export const Home = () => {
  const { user } = useStateContext();
  // const district = user?.district;

  const {
    data: donorData,
    isLoading: donorLoading,
    error: donorError,
  } = useGetDonorData(user?.userId);

  
  
  const totalAmountDonated = donorData?.totalAmountDonated ;
  const campaignsDonatedTo = donorData?.campaignsDonatedTo ;
  const nftCount = donorData?.nftCount ;
  const lastContributedDate = donorData?.lastContributedDate ;

  if (donorLoading) return <div>Loading...</div>;
  if (donorError )
    return <div className="text-red-500">No donation record.</div>;
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7 ">
        <CardDataStats
          title="Total Amount Donated"
          total={ " $" + totalAmountDonated }
          rate=""
          levelUp
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <IoEyeOutline className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats
          title="No. Of Cases Supported"
          total={campaignsDonatedTo}
          rate=""
          levelUp
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <CgShoppingCart className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Last Contributed"
          total={lastContributedDate}
          rate=""
          levelUp
        >
          <div className="bg-[#eff2f7] p-3 rounded-full">
            <FiShoppingBag className="text-[25px] text-[#5869e4]" />
          </div>
        </CardDataStats>
        <CardDataStats
          title="NFTs Awarded"
          total={nftCount}
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

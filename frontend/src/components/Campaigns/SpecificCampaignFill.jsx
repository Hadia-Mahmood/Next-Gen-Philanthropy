"use client";
import { useGetASpecificCampaignEntry } from "@/hooks/campaignEntries"; // Create a hook similar to useGetASpecificLandfillEntry
import usePagination from "@/utils/usePagination";
import React from "react";
import DataLoader from "../Shared/DataLoader";
import Pagination from "../Dashboard/Pagination";
import Link from "next/link";

const SpecificCampaignFill = ({ campaignID }) => {
  const paginate = usePagination();
  const { data, isLoading, isError } = useGetASpecificCampaignEntry(campaignID);
  const { currentPage, totalPages, visibleItems, goToPage } = paginate(data?.entries);
 
  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <DataLoader />
      </div>
    );
  }

  
  if (isError) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        Error loading campaign entries
      </div>
    );
  }

  if (visibleItems?.length === 0) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        No entries available for this campaign.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-20 bg-[#f7f9f8]">
      <h6 className="text-center font-bold text-[#f29620]">Campaign Entries</h6>
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-3 mb-5 lg:w-2/4 mx-auto text-center text-[#182822] leading-normal">
        Entries for {data?.campaignName}
      </h1>

      <div className="w-[90%] md:w-[80%] mx-auto overflow-x-auto lg:overflow-hidden">
        <div className="rounded-sm border border-stroke bg-white shadow-default font-poppins">
          <div className="py-4 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Campaign Entries
            </h4>
            <Link href="#" className="bg-[#f29620] text-[#fff] py-2 px-3 rounded-md text-sm">
              <button onClick={handleButtonClick}>
                View Blockchain Data
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-7 border-t border-stroke py-4 px-4 sm:grid-cols-8 md:px-6 2xl:px-7">
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Image</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">District</p>
            </div>
            <div className="hidden items-center sm:flex">
              <p className="font-medium">Area</p>
            </div>
            <div className="flex items-center col-span-2">
              <p className="font-medium">Subdivision</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium">Quantity Received</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium">Date</p>
            </div>
          </div>

          <div className="h-auto overflow-auto">
            {visibleItems &&
              visibleItems.map((item, key) => (
                <div key={key} className="grid grid-cols-7 border-t border-stroke py-2 px-4 sm:grid-cols-8 md:px-6 2xl:px-7">
                  <div className="col-span-1 flex items-center">
                    <img src={item?.image?.url} alt="item" className="w-20 h-12 rounded-md" />
                  </div>
                  <div className="hidden col-span-1 items-center sm:flex">
                    <p className="text-sm">{item?.district}</p>
                  </div>
                  <div className="hidden items-center sm:flex">
                    <p className="text-sm">{item?.area}</p>
                  </div>
                  <div className="flex items-center col-span-2">
                    <p className="text-sm">{item?.subdivision}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm">{item?.quantityReceived}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm">{formatDate(item?.date)}</p>
                  </div>
                </div>
              ))}
          </div>

          {visibleItems?.length > 5 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={goToPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificCampaignFill;

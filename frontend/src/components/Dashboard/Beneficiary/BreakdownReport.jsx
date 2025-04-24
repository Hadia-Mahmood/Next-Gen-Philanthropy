"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";
import Pagination from "../Pagination";
import usePagination from "@/utils/usePagination";
import DataLoader from "@/components/Shared/DataLoader";
import { useGetProgressReport } from "../../../hooks/beneficiary-hook"; 
import Link from "next/link";
 
const BreakdownReport = ({ applicationId }) => {
  const paginate = usePagination();
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    data: applicationData,
    isLoading,
    iserror,
  } = useGetProgressReport(applicationId);

  const ben_eth_address = applicationData?.user?.ethAddress || "";

  useEffect(() => {
    const fetchBeneficiaryNeeds = async () => {
      try {
        setLoading(true);
        const needsData = await TrustAidContractInteraction.getBeneficiaryNeeds(ben_eth_address);

        const formattedNeeds = needsData.map(need => ({
          needId: need[0].toString(),
          description: need[1],
          amountRequired: ethers.utils.formatEther(need[2]),
          needFulfilled: need[3] ? 'Yes' : 'No',
          proofSubmitted: need[4] ? 'Yes' : 'No',
          proofApproved: need[5] ? 'Yes' : 'No',
          timestamp: new Date(need[6] * 1000).toLocaleString(),
          amountDonated: ethers.utils.formatEther(need[7]),
          excessAmount: ethers.utils.formatEther(need[8]),
          ipfsHash: need[9].join(', ')
        }));

        setNeeds(formattedNeeds);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching beneficiary needs:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (ben_eth_address) {
      fetchBeneficiaryNeeds();
    }
  }, [ben_eth_address]);

  // Conditional UI returns should come AFTER all hooks
  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <DataLoader />
      </div>
    );
  }

  if (iserror || !applicationData) {
    return <div className="text-red-500">No breakdown found.</div>;
  }

  const { breakdowns } = applicationData;
  const { currentPage, totalPages, visibleItems, goToPage } = paginate(breakdowns);

  if (loading) return <div>Loading needs data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (needs.length === 0) return <div>No needs found for this beneficiary</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Need ID</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Amount Required (ETH)</th>
            <th className="py-2 px-4 border">Fulfilled</th>
            <th className="py-2 px-4 border">Proof Submitted</th>
            <th className="py-2 px-4 border">Proof Approved</th>
            <th className="py-2 px-4 border">Amount Donated (ETH)</th>
            <th className="py-2 px-4 border">Excess Amount (ETH)</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Proof</th>
          </tr>
        </thead>
        <tbody>
          {needs.slice(0, visibleItems.length).map((need, index) => {
            const breakdown = visibleItems[index];
            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{need.needId}</td>
                <td className="py-2 px-4 border">{need.description}</td>
                <td className="py-2 px-4 border">{need.amountRequired}</td>
                <td className="py-2 px-4 border">{need.needFulfilled}</td>
                <td className="py-2 px-4 border">{need.proofSubmitted}</td>
                <td className="py-2 px-4 border">{need.proofApproved}</td>
                <td className="py-2 px-4 border">{need.amountDonated}</td>
                <td className="py-2 px-4 border">{need.excessAmount}</td>
                <td className="py-2 px-4 border">{breakdown?.breakdownStatus || "N/A"}</td>
                <td className="py-2 px-4 border truncate max-w-xs">
                  {need.proofApproved === "Yes" ? (
                    <Link
                      href={`/dashboard/beneficiary/proof-details?breakdownId=${breakdown?.id}`}
                      className="text-sm text-black hover:underline"
                    >
                      View
                    </Link>
                  ) : breakdown?.breakdownStatus === "inactive" ? (
                    <p className="text-sm text-gray-500">N/A</p>
                  ) : need.proofSubmitted === "No" &&
                    need.amountRequired === need.amountDonated ? (
                    <Link
                      href={`/dashboard/beneficiary/unlock-milestone`}
                      className="text-sm text-blue-600 hover:underline font-semibold"
                    >
                      Upload Proof
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-500">N/A</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {breakdowns.length > 5 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default BreakdownReport;













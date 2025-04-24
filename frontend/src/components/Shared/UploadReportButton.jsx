"use client";
import html2canvas from "html2canvas";
import { uploadFileToIPFS } from "@/utils/uploadFileToIPFS";
import { toast } from "react-toastify";
import WasteManagementContractInteraction from "@/utils/wasteMangementContractInteraction";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import {
  useNewUpdateUrl
} from "@/hooks/landfillEntries";

import {
  useNewUpdateRUrl , 
  useNewUpdateRUrlO
} from "@/hooks/recyclePointEntries";

const UploadReportButton = ({ tableRef, reportType }) => {

  const [data, setData] = useState({
    latestUrl: "",
  });

  const { mutate: addMutate } = useNewUpdateUrl(JSON.stringify(data));
  const { mutate: addMutate1 } = useNewUpdateRUrl(JSON.stringify(data));
  const { mutate: addMutate2 } = useNewUpdateRUrlO(JSON.stringify(data));
  const [loading, setLoading] = useState(false);

  const handleCaptureAndUpload = async () => {
    setLoading(true);
    if (tableRef.current) {
      try {
        const canvas = await html2canvas(tableRef.current, {
          // Options for html2canvas
          scale: window.devicePixelRatio, // Adjusts for device pixel ratio
          useCORS: true, // Tries to use CORS-compliant images
          logging: true, // Enables logging for debugging
          // other options as needed...
        });
        canvas.toBlob(async (blob) => {

          const response = await uploadFileToIPFS(blob);
          console.log("ipfs")
          console.log(response?.data?.IpfsHash)
          setData(prevData => ({
            ...prevData,
            latestUrl: response?.data?.IpfsHash,
          }));

          try {
            await WasteManagementContractInteraction.AddWeeklyReport(
              new Date(),
              response?.data?.IpfsHash,
              reportType
            );

            toast.success("Report Uploaded to IPFS");
            if (reportType =="landfillEntries"){
              addMutate(
                {},
                {
                  onSuccess: (response) => {
                    console.log("OnSuccess")

                  },
                  onError: (response) => {
                    console.log("OnError")
                  },
                }
              );
            }else if(reportType =="recyclingInputEntries"){
              addMutate1(
                {},
                {
                  onSuccess: (response) => {
                    console.log("OnSuccess")

                  },
                  onError: (response) => {
                    console.log("OnError")
                  },
                }
              );
            } else if (reportType =="recyclingOutputEntries"){
              addMutate2(
                {},
                {
                  onSuccess: (response) => {
                    console.log("OnSuccess")

                  },
                  onError: (response) => {
                    console.log("OnError")
                  },
                }
              );
            }
            setLoading(false);
          } catch (error) {
            console.log(error)
            toast.error(error?.message);
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        toast.error(error);
        setLoading(false);
      }
    }
  };
 
  return (
    <button
      onClick={handleCaptureAndUpload}
      disabled={loading}
      className={` ${
        loading && "opacity-70"
      } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
    >
      {loading ? (
        <FaSpinner className="animate-spin  text-white" />
      ) : (
        "Upload Report"
      )}
    </button>
  );
};

export default UploadReportButton;

"use client";
import React, { useState } from "react";
import LeaderboardItem from "./LeaderboardItem";
import { Award, Trophy } from "lucide-react";
import { useGetTopDonors } from "../../../hooks/organization-hook";
import CharityNFTContractInteraction from "@/utils/nftContractIntegration";
import { toast } from "react-toastify";
import { useDonorNFT } from "../../../hooks/organization-hook";
import { useRouter } from "next/navigation";

const Leaderboard = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetTopDonors();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAwarding, setIsAwarding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize the mutation hook (no data passed here)
  const { mutate: addMutate } = useDonorNFT();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Transform the API data
  const leaderboardData = data?.topDonors?.map((donor, index) => ({
    id: donor.userId,
    name: donor.name,
    score: donor.totalDonatedThisMonth,
    rank: index + 1,
    ethAddress: donor.ethAddress,
  })) || [];

  const handleSubmitDonorNFT = async (ethAddress, tokenURI) => {
    try {
      setLoading(true);
      // Pass the data when calling mutate
      await addMutate({ ethAddress, tokenURI }, {
        onSuccess: (response) => {
          toast.success(response?.data?.message);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        },
        onSettled: () => {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to process");
      setLoading(false);
    }
  };

  // ... rest of your component code ...
  const handleUpdateTopDonors = async () => {
    if (!leaderboardData || leaderboardData.length < 3) {
      toast.error("Need at least 3 donors to update top donors");
      return;
    }

    try {
      setIsUpdating(true);
      // Extract the top 3 donor addresses
      const topDonors = [
        leaderboardData[0].ethAddress,
        leaderboardData[1].ethAddress,
        leaderboardData[2].ethAddress,
      ];

      // Call the smart contract function
      const tx = await CharityNFTContractInteraction.updateTopDonors(topDonors);
      await tx.wait();
      
      toast.success("Top donors updated successfully!");
    } catch (err) {
      console.error("Error updating top donors:", err);
      toast.error(`Failed to update top donors: ${err.message}`);
    } finally {
      setIsUpdating(false); 
    }
  };

  const handleAwardTopDonors = async () => {
    try {
      setIsAwarding(true);
      
      // 1. Award NFTs from the smart contract
      const tx = await CharityNFTContractInteraction.awardTopDonorsNFTs();
      await tx.wait();
      
      // 2. Get the updated top donors and their metadata
      const topDonors = await CharityNFTContractInteraction.getTopDonors();
      const metadataURIs = await CharityNFTContractInteraction.getCurrentMetadataSet();
      
      // 3. Call useDonorNFT for each donor
      for (let i = 0; i < 3; i++) {
        console.log(topDonors[i], metadataURIs[i]);
        await handleSubmitDonorNFT(topDonors[i], metadataURIs[i]);
      }
      
      toast.success("NFTs awarded to top donors successfully!");
    } catch (err) {
      console.error("Error awarding NFTs:", err);
      toast.error(`Failed to award NFTs: ${err.message}`);
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto transition-all duration-300 hover:scale-[1.01]">
      <div className="bg-leaderboard-bg border-4 border-leaderboard-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-32 w-32 bg-yellow-300 opacity-20 rounded-full"></div>
        <div className="absolute -left-16 -bottom-16 h-32 w-32 bg-yellow-300 opacity-20 rounded-full"></div>

        <h1
          className="text-red-600 text-6xl font-game mb-8 text-center tracking-wide uppercase animate-bounce-subtle"
          style={{
            textShadow:
              "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          LEADERBOARD
        </h1>

        <div className="space-y-4">
          {leaderboardData.map((player, index) => (
            <div
              key={player.id}
              className="transform transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LeaderboardItem
                rank={player.rank}
                name={player.name}
                score={player.score}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handleUpdateTopDonors}
            disabled={isUpdating}
            className={`bg-leaderboard-rank4 text-white px-6 py-3 rounded-full font-game tracking-wide flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span>{isUpdating ? "UPDATING..." : "UPDATE TOP DONOR"}</span>
          </button>

          <button 
            onClick={handleAwardTopDonors}
            disabled={isAwarding || loading}
            className={`bg-amber-500 text-white px-6 py-3 rounded-full font-game tracking-wide flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
              isAwarding || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Award className="h-5 w-5" />
            <span>{isAwarding || loading ? "PROCESSING..." : "AWARD TOP DONORS"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
// "use client";
// import React, { useState } from "react";
// import LeaderboardItem from "./LeaderboardItem";
// import { Award, Trophy } from "lucide-react";
// import { useGetTopDonors } from "../../../hooks/organization-hook";
// import CharityNFTContractInteraction from "@/utils/nftContractIntegration";
// import { toast } from "react-toastify";


// import { useDonorNFT } from "../../../hooks/organization-hook";

// const Leaderboard = () => {
//   const { topDonor, isLoading, error } = useGetTopDonors();
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isAwarding, setIsAwarding] = useState(false);
//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;


//     const [data, setData] = useState({
//         tokenURI: "",
//         ethAddress: "",
//       });
    
//   const { mutate: addMutate } = useDonorNFT(JSON.stringify(data));

//    const handleSubmit = async () => {
     
//       try {
        
//         addMutate(
          
//           {
//             onSuccess: (response) => {
//               toast.success(response?.data?.message);
//               router.push("/dashboard/organization");
//             },
//             onError: (error) => {
//               toast.error(error.response?.data?.message || "Something went wrong");
//             },
//             onSettled: () => {
//               setLoading(false);
//             }
//           }
//         );
//       } catch (error) {
//         console.error("Submission error:", error);
//         toast.error(error.message || "Failed to process ");
//         setLoading(false);
//       }
//     };
  



//   // Transform the API data
//   const leaderboardData = topDonor?.topDonors?.map((donor, index) => ({
//     id: donor.userId,
//     name: donor.name,
//     score: donor.totalDonatedThisMonth,
//     rank: index + 1,
//     ethAddress: donor.ethAddress,
//   })) || [];

//   const handleUpdateTopDonors = async () => {
//     if (!leaderboardData || leaderboardData.length < 3) {
//       toast.error("Need at least 3 donors to update top donors");
//       return;
//     }

//     try {
//       setIsUpdating(true);
//       // Extract the top 3 donor addresses
//       const topDonors = [
//         leaderboardData[0].ethAddress,
//         leaderboardData[1].ethAddress,
//         leaderboardData[2].ethAddress,
//       ];

//       // Call the smart contract function
//       const tx = await CharityNFTContractInteraction.updateTopDonors(topDonors);
//       await tx.wait();
      
//       toast.success("Top donors updated successfully!");
//     } catch (err) {
//       console.error("Error updating top donors:", err);
//       toast.error(`Failed to update top donors: ${err.message}`);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleAwardTopDonors = async () => {
//     try {
//       setIsAwarding(true);
//       // Call the smart contract function
//       const tx = await CharityNFTContractInteraction.awardTopDonorsNFTs();
//       await tx.wait();
      
//       toast.success("NFTs awarded to top donors successfully!");
//     } catch (err) {
//       console.error("Error awarding NFTs:", err);
//       toast.error(`Failed to award NFTs: ${err.message}`);
//     } finally {
//       setIsAwarding(false);
//     }
//   };

//   return (
//     <div className="relative max-w-2xl mx-auto transition-all duration-300 hover:scale-[1.01]">
//       <div className="bg-leaderboard-bg border-4 border-leaderboard-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
//         <div className="absolute -right-16 -top-16 h-32 w-32 bg-yellow-300 opacity-20 rounded-full"></div>
//         <div className="absolute -left-16 -bottom-16 h-32 w-32 bg-yellow-300 opacity-20 rounded-full"></div>

//         <h1
//           className="text-red-600 text-6xl font-game mb-8 text-center tracking-wide uppercase animate-bounce-subtle"
//           style={{
//             textShadow:
//               "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
//           }}
//         >
//           LEADERBOARD
//         </h1>

//         <div className="space-y-4">
//           {leaderboardData.map((player, index) => (
//             <div
//               key={player.id}
//               className="transform transition-all duration-300 hover:scale-[1.02]"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <LeaderboardItem
//                 rank={player.rank}
//                 name={player.name}
//                 score={player.score}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center gap-4 mt-8">
//           <button 
//             onClick={handleUpdateTopDonors}
//             disabled={isUpdating}
//             className={`bg-leaderboard-rank4 text-white px-6 py-3 rounded-full font-game tracking-wide flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
//               isUpdating ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <Trophy className="h-5 w-5" />
//             <span>{isUpdating ? "UPDATING..." : "UPDATE TOP DONOR"}</span>
//           </button>

//           <button 
//             onClick={handleAwardTopDonors}
//             disabled={isAwarding}
//             className={`bg-amber-500 text-white px-6 py-3 rounded-full font-game tracking-wide flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
//               isAwarding ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <Award className="h-5 w-5" />
//             <span>{isAwarding ? "AWARDING..." : "AWARD TOP DONORS"}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;
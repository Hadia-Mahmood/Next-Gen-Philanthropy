
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import UserService from '../services/user-service'; // Adjust the path as needed


const useGetAllCampaignPoints = () => {
  return useQuery({
    queryKey: ["/campaign/get-all-campaign-points"], // Use queryKey as an object property
    queryFn: () => UserService.getAllCampaignPoints(), // Use queryFn as the function to call
  });
};

const useGetASpecificCampaignEntry = (campaignID) => {
  return useQuery(["/campaign/get-specific-campaign-entry", campaignID], () => 
    UserService.getSpecificCampaignEntry(campaignID)
  );
};




export  {
  
  useGetAllCampaignPoints, 
  useGetASpecificCampaignEntry,
};



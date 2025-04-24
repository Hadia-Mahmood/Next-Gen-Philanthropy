import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import DonorService from "../services/donor-service";

import AuthService from "../services/auth-service";
 
 

const useGetDonorStatistic = (userId) => {
  return useQuery(["/donor/donationStatistics", userId], () =>
    DonorService.getDonorStatistics(userId)
  );
};

const useGetDonorCampaigns = (userId) => {
  return useQuery(["/donor/donatedCampaigns", userId], () =>
    DonorService.getDonorCampaigns(userId)
  );
};


const useGetDonorCollection = (userId) => {
  return useQuery(["/donor/userCollection", userId], () =>
    DonorService.getDonorCollection(userId)
  );
};

const useGetDonorData = (userId) => {
  return useQuery(["/donor/getDonorData", userId], () =>
    DonorService.getDonorData(userId)
  );
};

const useFundCampaign = (data) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return DonorService.fundCampaign(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};


export {
    useGetDonorStatistic,useGetDonorData,useFundCampaign,useGetDonorCollection,useGetDonorCampaigns
};

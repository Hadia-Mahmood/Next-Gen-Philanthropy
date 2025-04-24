 import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
 import OrganizationService from "../services/organization-service";
 import AuthService from "../services/auth-service";
 
 
 
 
 const useGetOrganizationStatistics = () => {
   return useQuery(["organization/get-organization-statistics"], () =>
     OrganizationService.getOrganizationStatistics()
   );
 };
 const useGetUserStatistics = () => {
  return useQuery(["organization/get-user-statistics"], () =>
    OrganizationService.getUserStatistics()
  );
};

const useGetTopDonors = () => {
  return useQuery(["organization/get-top-donors"], () =>
    OrganizationService.getTopDonors()
  );
};

const useGetWaitingApplications = () => {
  return useQuery(["organization/get-waiting-application"], () =>
    OrganizationService.getWaitingApplications()
  );
};

const useGetApplicationById = (applicationId) => {
  return useQuery(["/organization/getApplicationById", applicationId], () =>
    OrganizationService.getApplicationById(applicationId)
  );
};

const useApplicationApproval = (data) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return OrganizationService.applicationApproval(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};

const useGetWaitingBreakdownProof = () => {
  return useQuery(["organization/get-waiting-application"], () =>
    OrganizationService.getWaitingBreakdownProof()
  );
};

 
const useGetBreakdownProofById = (breakdownProofId) => {
  return useQuery(["/organization/getBreakdownProofById", breakdownProofId], () =>
    OrganizationService.getBreakdownProofById(breakdownProofId)
  );
};

const useProofStatus = (data) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return OrganizationService.updateProofStatus(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};

 
const useGetApprovedApplications = () => {
  return useQuery(["organization/get-approved-application"], () =>
    OrganizationService.getApprovedApplications()
  ); 
};


const useDonorNFT = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {  // Accept data as parameter here
      return OrganizationService.updateDonorNFT(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};
 export { useGetOrganizationStatistics, useGetTopDonors, useGetUserStatistics,useDonorNFT,
   useGetWaitingApplications, useGetApplicationById,useGetApprovedApplications,
   useApplicationApproval,useGetWaitingBreakdownProof,useGetBreakdownProofById,useProofStatus,
   
 };
 
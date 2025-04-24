import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import BeneficiaryEntry from "../services/beneficiary-service";
import AuthService from "../services/auth-service";



const useCreateApplication = (data) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return BeneficiaryEntry.createApplication(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};
const useGetApplicationData = (userId) => {
    return useQuery(["/beneficiary/getApplicationData", userId], () =>
      BeneficiaryEntry.getApplicationData(userId)
    );
};

const useGetAllApplicationData = (userId) => {
  return useQuery(["/beneficiary/getAllApplicationData", userId], () =>
    BeneficiaryEntry.getAllApplicationData(userId)
  );
};
const useUnlockMilestoneId = (userId) => {
  return useQuery(["/beneficiary/unlock-need-id", userId], () =>
    BeneficiaryEntry.unlockMilestoneId(userId)
  );
};
 
const useUnlockMilestone = (data) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return BeneficiaryEntry.unlockMilestone(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};




const useGetProgressReport = (applicationId) => {
  return useQuery(["/beneficiary/getProgressReport", applicationId], () =>
    BeneficiaryEntry.getProgressReport(applicationId)
  );
};
const useGetBreakdownProof = (breakdownId) => {
  return useQuery(["/beneficiary/getBreakdownProof", breakdownId], () =>
    BeneficiaryEntry.getBreakdownProof(breakdownId)
  );
};



export {
  useCreateApplication,useGetBreakdownProof, useUnlockMilestoneId,useGetApplicationData, useGetAllApplicationData, useUnlockMilestone,useGetProgressReport
};

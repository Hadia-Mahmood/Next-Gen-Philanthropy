import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ComplainService from "../services/complain-service";
import AuthService from "../services/auth-service";

const useComplain = (userData) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return ComplainService.complain(userData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
}; 


const useAddResponseToComplaint = () => {
  const mutation = useMutation(({ complaintId, data }) =>
    ComplainService.addResponseToComplaint(complaintId, data)
  );

  const addResponse = async (complaintId, data) => {
    try {
      const response = await mutation.mutateAsync({ complaintId, data });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    addResponse,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
  };
};

const useGetComplaintsInDistrict = (district) => {
  return useQuery(["complaint/get-complaints-district", district], () =>
    ComplainService.getComplaintsInDistrict(district)
  );
};

const useDeleteComplaint = () => {
  console.log("HOOK")
  return useMutation((complaintId) => ComplainService.deleteComplaintById(complaintId));
};

export {
  useComplain,
  useAddResponseToComplaint,
  useGetComplaintsInDistrict,
  useDeleteComplaint,
};

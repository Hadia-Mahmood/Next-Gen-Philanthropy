import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AuthService from "../services/auth-service";

const useUserId = () => {
  return useQuery({ queryKey: ["user"], queryFn: () => AuthService.getMyId() });
};

const useUserSignup = (userData) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return AuthService.signUpUser(userData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};

const  useUserLogin = (userData) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return AuthService.LoginUser(userData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("login");
      },
    }
  );
};

const useUserForgotPassword = (userData) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return AuthService.ForgotPassword(userData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("forgotPassword");
      },
    }
  );
};

const useUserResetPassword = (userData) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return AuthService.ResetPassword(userData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("resetPassword");
      },
    }
  );
};

const useGetAllUsers = () => {
  console.log("DAAAAAAAATA222");
  return useQuery(["allUsers"], AuthService.getAllUsers);
};

const useUpdate = () => {
  const mutation = useMutation(({ threadId, data }) =>
    AuthService.updateRole(threadId, data)
  );

  const addResponsee = async (threadId, data) => {
    try {
      const response = await mutation.mutateAsync({ threadId, data });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    addResponsee,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
  };
};

const useGetWalletAddress = (userId) => {
    return useQuery(["/get-eth-address", userId], () =>
      AuthService.getWalletAddress(userId)
    );
};

const useGetApprovedApplications = () => {
  return useQuery(["/get-all-approved-application"], () =>
    AuthService.getApprovedApplications()
  ); 
};

export {
  useUserSignup,
  useGetWalletAddress,
  useUserLogin,
  useUserId,
  useGetAllUsers,
  useUserForgotPassword,
  useUserResetPassword,
  useUpdate,
  useGetApprovedApplications,
};

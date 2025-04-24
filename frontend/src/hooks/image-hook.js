import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ImageService from "../services/image-service";
import AuthService from "../services/auth-service";



  



const useUploadImage = (data) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return  ImageService.uploadImage(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("signup");
      },
    }
  );
};




export {useUploadImage,
};














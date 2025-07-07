import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import http from "@/http/api";

export const usePut = (url, key, options = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => http.put(url, data),
    onSuccess: (res) => {
      console.log("Success response:", res);
      queryClient.invalidateQueries([key]);
      toast({
        variant: "success",
        title: res.data.message,
      });

      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      // console.log(error);
      toast({
        variant: "destructive",
        title: "Error updating:",
        description: error.message,
      });

      if (options.onError) {
        options.onError(error);
      }
    },
  });

  return mutation;
};

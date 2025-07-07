import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import http from "@/http/api";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

const useDelete = <TData = any, TVariables = any>(
  url: string,
  key: (string | number)[],
  options: UseMutationOptions<AxiosResponse<TData>, any, TVariables> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return http.delete(url);
    },
    onSuccess: (res, variables, context) => {
      console.log("Success response:", res);
      console.log("Delte key", key);
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.refetchQueries({ queryKey: key });
      toast("success");
      if (options.onSuccess) {
        options.onSuccess(res, variables, context);
      }
    },
    onError: (err, variables, context) => {
      console.error(err);
      toast("error");
      if (options.onError) {
        options.onError(err, variables, context);
      }
    },
    ...options,
  });
};

export default useDelete;

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
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({ queryKey: key });
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
  });
};

export default useDelete;

import http from "@/http/api";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

const usePatch = <TData, TVariables = any>(
  url: string,
  key: string[],
  options: UseMutationOptions<AxiosResponse<TData>, any, TVariables> = {},
  config: AxiosRequestConfig = {}
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AxiosResponse<TData>, any, TVariables>({
    mutationFn: (data) => http.patch<TData>(url, data, config),
    onSuccess: (res, variables, context) => {
      console.log("Patch success response:", res);
      queryClient.invalidateQueries({ queryKey: key });
      toast("success");

      if (options.onSuccess) {
        options.onSuccess(res, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("Patch error:", error);
      toast("error");

      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
};

export default usePatch;

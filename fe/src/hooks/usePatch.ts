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
  key: any[],
  options: UseMutationOptions<AxiosResponse<TData>, any, TVariables> = {},
  config: AxiosRequestConfig = {}
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AxiosResponse<TData>, any, TVariables>({
    mutationFn: (data) => http.patch<TData>(url, data, config),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success("Updated successfully");

      options.onSuccess?.(res, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Patch error:", error);
      toast.error("Failed to update");

      options.onError?.(error, variables, context);
    },
  });

  return mutation;
};

export default usePatch;

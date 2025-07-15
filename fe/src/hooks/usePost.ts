import http from "@/http/api";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

const usePost = <TData, TVariables = any>(
  url: string,
  key: [string],
  options: UseMutationOptions<AxiosResponse<TData>, any, TVariables> = {},
  config: AxiosRequestConfig = {}
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AxiosResponse<TData>, any, TVariables>({
    mutationFn: (data) => http.post<TData>(url, data, config),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.refetchQueries({ queryKey: key });

      toast("success");
      options.onSuccess?.(res, variables, context);
    },
    onError: (err, variables, context) => {
      console.error(err);
      toast("error");
      options.onError?.(err, variables, context);
    },
  });

  return mutation;
};

export default usePost;

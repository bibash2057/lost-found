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
    onSuccess: (res, variables, context) => {
      console.log("res", res);
      console.log("Post key", key);
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

  return mutation;
};

export default usePost;

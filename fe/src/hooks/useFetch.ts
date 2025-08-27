import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import http from "@/http/api";
import type { AxiosRequestConfig } from "axios";

const useFetch = <T = any>(
  url: string,
  key: (string | number)[],
  config: AxiosRequestConfig = {}
): UseQueryResult<T, Error> => {
  const normalizedQueryKey = Array.isArray(key) ? key : [key];
 return useQuery({
    queryFn: async () => {
      const res = await http.get<T>(url, config);
      return res.data;
    },
    queryKey: normalizedQueryKey,
    enabled: !!url,
    staleTime: 5 * 60 * 1000,
  });

};

export default useFetch;

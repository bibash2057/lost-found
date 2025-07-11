import { useEffect, useState } from "react";

type UseDebounceValue = {
  value: string;
  delay?: number;
};

const useDebounce = ({ value, delay = 1000 }: UseDebounceValue) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

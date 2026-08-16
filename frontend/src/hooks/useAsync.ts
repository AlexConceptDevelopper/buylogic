import { useCallback, useState } from "react";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export default function useAsync<T>() {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (asyncFunction: () => Promise<T | null>): Promise<T | null> => {
      setState({
        data: null,
        loading: true,
        error: null,
      });

      try {
        const data = await asyncFunction();

        setState({
          data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Une erreur est survenue.";

        setState({
          data: null,
          loading: false,
          error: message,
        });

        return null;
      }
    },
    [],
  );

  return {
    ...state,
    execute,
  };
}
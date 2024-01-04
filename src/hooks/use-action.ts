import { useCallback, useState } from "react";

import { ActionState, FielErrors } from "@/lib/create-safe-action";

type Action<TInput, TOuput> = (data: TInput) => Promise<ActionState<TInput, TOuput>>;

interface UseActionProps<TOuput> {
  onSuccess?: (data: TOuput) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

export const useAction = <TInput, TOuput>(
  action: Action<TInput, TOuput>,
  props: UseActionProps<TOuput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<FielErrors<TInput> | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOuput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (data: TInput) => {
      setIsLoading(true);

      try {
        const results = await action(data);

        if (!results) {
          return;
        }

        setFieldErrors(results.fielErrors);

        if (results.error) {
          setError(results.error);
          props.onError?.(results.error);
        }

        if (results.data) {
          setData(results.data);
          props.onSuccess?.(results.data);
        }
      } finally {
        setIsLoading(false);
        props.onCompleted?.();
      }
    },
    [action, props]
  );

  return { execute, fieldErrors, error, data, isLoading };
};

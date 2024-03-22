import * as z from "zod";

export type FielErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOuput> = {
  fielErrors?: FielErrors<TInput>;
  error?: string | null;
  data?: TOuput;
};

export const createSafeAction = <TInput, TOuput>(
  schema: z.Schema<TInput>,
  handler: (validData: TInput) => Promise<ActionState<TInput, TOuput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOuput>> => {
    const results = schema.safeParse(data);

    if (!results.success) {
      return {
        fielErrors: results.error.flatten().fieldErrors as FielErrors<TInput>,
      };
    }

    return handler(results.data);
  };
};

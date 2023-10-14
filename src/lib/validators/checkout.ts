import { z } from "zod";

export const CheckoutSchema = z.object({
  plan: z.string(),
});

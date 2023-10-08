import { z } from "zod";

export const SendMessageSchema = z.object({
  fileId: z.string().uuid(),
  message: z.string(),
});

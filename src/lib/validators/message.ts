import { z } from "zod";

export const SendMessageSchema = z.object({
  fileId: z.string().uuid(),
  message: z.string(),
});

export const GetFileMessagesSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  fileId: z.string().uuid(),
});

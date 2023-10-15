import { z } from "zod";

export const MyAiDataSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(200),
  imgUrl: z.string().url(),
});

export type MyAiBioType = z.infer<typeof MyAiDataSchema>;

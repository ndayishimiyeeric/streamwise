import { z } from "zod";

export const UserDataSchema = z.object({
  imgUrl: z.string().url(),
  name: z.string().min(3).max(70),
});

export type UserDataSchemaType = z.infer<typeof UserDataSchema>;

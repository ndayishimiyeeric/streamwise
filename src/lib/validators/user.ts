import { z } from "zod";

export const UserDataSchema = z.object({
  imgUrl: z.string().url(),
});

export type UserDataSchemaType = z.infer<typeof UserDataSchema>;

import { z } from "zod";

export const DeleteFileInput = z.object({
  id: z.string().uuid(),
});

export type DeleteFileInputType = z.infer<typeof DeleteFileInput>;

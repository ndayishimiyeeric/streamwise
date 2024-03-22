import * as z from "zod";

export const DeleteFile = z.object({
  id: z.string({ required_error: "id is required", invalid_type_error: "id must be a string" }),
});

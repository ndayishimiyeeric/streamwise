import * as z from "zod";

export const ProcessFile = z.object({
  url: z.string({ required_error: "url is required", invalid_type_error: "url must be a string" }),
  fileId: z.string({
    required_error: "fileId is required",
    invalid_type_error: "fileId must be a string",
  }),
  name: z.string({
    required_error: "name is required",
    invalid_type_error: "name must be a string",
  }),
  pagesToDelete: z.optional(z.array(z.number())),
});

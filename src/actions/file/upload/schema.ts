import * as z from "zod";

export const UploadFile = z.object({
  url: z.string({ required_error: "url is required", invalid_type_error: "url must be a string" }),
  key: z.string({ required_error: "key is required", invalid_type_error: "key must be a string" }),
  size: z.number({
    required_error: "size is required",
    invalid_type_error: "size must be a number",
  }),
  name: z.string({
    required_error: "name is required",
    invalid_type_error: "name must be a string",
  }),
});

import { UnstructuredClient } from "unstructured-client";

export const usClient = new UnstructuredClient({
  security: {
    apiKeyAuth: process.env.UNSTRUCTURED_API_KEY!,
  },
});

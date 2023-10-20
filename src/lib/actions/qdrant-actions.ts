import { qdrantClient } from "@/lib/qdrant";
import { ApiError } from "@qdrant/openapi-typescript-fetch";

export const getOrCreateCollectionIfNotExists = async (fileId: string) => {
  try {
    return await qdrantClient.getCollection(fileId);
  } catch (error) {
    if (error instanceof ApiError) {
      await qdrantClient.createCollection(fileId, {
        vectors: {
          size: 1536,
          distance: "Cosine",
        },
      });

      return await qdrantClient.getCollection(fileId);
    }
    console.log("error", error);
  }
};

import { Pinecone } from "@pinecone-database/pinecone";

export const getPinecone = async () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

  return { pinecone, index };
};

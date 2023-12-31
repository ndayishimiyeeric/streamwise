import { CharacterTextSplitter } from "langchain/text_splitter";

export const getFileChunks = async (
  document: Record<string, any>[],
  len: number
): Promise<string[]> => {
  const text_splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 200,
    chunkOverlap: 80,
    lengthFunction: (text) => text.length,
  });

  const chunks: string[] = [];
  let i = 0;
  while (i < len) {
    const text = document[i].pageContent.replace(/\n/gm, " ");
    const chunk = await text_splitter.splitText(text);
    chunks.push(...chunk);
    i++;
  }
  console.log("chunks", chunks);
  return chunks;
};

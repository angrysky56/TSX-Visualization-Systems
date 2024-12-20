import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient('localhost:19530');

export async function connect(collection: string) {
  try {
    await client.loadCollection({
      collection_name: collection,
    });
    return { success: true };
  } catch (error) {
    console.error('Milvus connection error:', error);
    throw error;
  }
}

export async function search(vectors: number[][], collection: string) {
  try {
    const searchResult = await client.search({
      collection_name: collection,
      vectors: vectors,
      limit: 10,
      output_fields: ['*'],
    });
    return searchResult;
  } catch (error) {
    console.error('Milvus search error:', error);
    throw error;
  }
}


import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const config = {
  address: import.meta.env.VITE_MILVUS_HOST || 'localhost',
  port: import.meta.env.VITE_MILVUS_PORT ? parseInt(import.meta.env.VITE_MILVUS_PORT) : 19530,
  ssl: false
};

let client: MilvusClient | null = null;

export const initMilvusConnection = async () => {
  try {
    client = new MilvusClient(config);
    await client.checkHealth();
    return { success: true, client };
  } catch (error) {
    console.error('⧉ Quantum coherence disruption:', error);
    return { success: false, error };
  }
};

export const getPatternVectors = async () => {
  if (!client) {
    await initMilvusConnection();
  }

  try {
    const response = await client!.query({
      collection_name: 'quantum_states',
      output_fields: ['vector', 'coherence', 'timestamp'],
      limit: 100
    });

    return {
      success: true,
      vectors: response.data.map(item => ({
        vector: item.vector,
        coherence: item.coherence,
        timestamp: item.timestamp
      }))
    };
  } catch (error) {
    console.error('⧬ Vector retrieval disruption:', error);
    return { success: false, error };
  }
};

export const insertPatternVector = async (
  vector: number[],
  coherence: number
) => {
  if (!client) {
    await initMilvusConnection();
  }

  try {
    await client!.insert({
      collection_name: 'quantum_states',
      data: [{
        vector,
        coherence,
        timestamp: Date.now()
      }]
    });

    return { success: true };
  } catch (error) {
    console.error('⫰ Vector insertion disruption:', error);
    return { success: false, error };
  }
};

export const queryMilvusStatus = async () => {
  if (!client) {
    await initMilvusConnection();
  }

  try {
    const stats = await client!.getCollectionStatistics({
      collection_name: 'quantum_states'
    });

    return {
      success: true,
      stats: {
        dimensionCount: 512,
        vectorCount: parseInt(stats.data.row_count),
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('⧉ Status retrieval disruption:', error);
    return { success: false, error };
  }
};


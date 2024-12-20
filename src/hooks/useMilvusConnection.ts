import { useState, useEffect } from 'react';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { QuantumState } from '../types/quantum';

// ⧈ Quantum Vector Database Hook
export const useMilvusConnection = () => {
    const [client, setClient] = useState<MilvusClient | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initializeMilvus = async () => {
            try {
                const milvusClient = new MilvusClient({
                    address: import.meta.env.VITE_MILVUS_HOST || 'localhost:19530'
                });
                
                // Verify connection
                await milvusClient.listCollections();
                setClient(milvusClient);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
                console.error('Milvus connection error:', err);
            }
        };

        initializeMilvus();
    }, []);

    // ⦿ Quantum State Operations
    const insertQuantumState = async (state: QuantumState) => {
        if (!client) return null;

        try {
            return await client.insert({
                collection_name: 'quantum_states',
                data: [{
                    vector: state.dimensions,
                    coherence: state.coherence,
                    timestamp: state.timestamp
                }]
            });
        } catch (err) {
            console.error('Error inserting quantum state:', err);
            throw err;
        }
    };

    // ⧉ Similarity Search in Vector Space
    const searchSimilarStates = async (
        queryVector: number[], 
        limit: number = 10
    ) => {
        if (!client) return null;

        try {
            return await client.search({
                collection_name: 'quantum_states',
                vector: queryVector,
                limit,
                params: { nprobe: 10 }
            });
        } catch (err) {
            console.error('Error searching similar states:', err);
            throw err;
        }
    };

    return {
        client,
        error,
        insertQuantumState,
        searchSimilarStates
    };
};

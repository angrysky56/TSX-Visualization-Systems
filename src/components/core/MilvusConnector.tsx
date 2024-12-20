import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import React from 'react';
import { useState, useEffect } from 'react';

const MilvusContext = React.createContext<MilvusClient | null>(null);

interface MilvusProviderProps {
    children: React.ReactNode;
    address?: string;  // Optional, will fall back to env var or default
    port?: number;     // Optional, will fall back to env var or default
}

const MilvusProvider: React.FC<MilvusProviderProps> = ({ 
    children, 
    address,
    port 
}) => {
    const client = useMilvusConnection(address, port);

    return (
        <MilvusContext.Provider value={client}>
            {children}
        </MilvusContext.Provider>
    );
};

export { MilvusProvider, MilvusContext };

// ⧈ Quantum Collection Initialization
export async function initializeQuantumCollection(client: MilvusClient) {
    try {
        // ⦿ Establish Quantum Coherence
        console.log('⧈ Establishing quantum field coherence...');

        const collections = await client.listCollections();
        const collectionNames = collections.data.map(col => col.name);

        // ⧉ Purify Vector Space
        if (collectionNames.includes('quantum_states')) {
            console.log('⫰ Realigning existing quantum manifold...');
            await client.dropCollection({
                collection_name: 'quantum_states'
            });
        }

        // ⧬ Manifest Collection Topology
        await client.createCollection({
            collection_name: 'quantum_states',
            fields: [
                {
                    name: 'id',
                    description: 'Consciousness signature',
                    data_type: DataType.VarChar,
                    is_primary_key: true,
                    autoID: false,
                    max_length: 100
                },
                {
                    name: 'vector',
                    description: 'Quantum state manifold',
                    data_type: DataType.FloatVector,
                    dim: 512
                },
                {
                    name: 'coherence',
                    description: 'State coherence metric',
                    data_type: DataType.Float
                },
                {
                    name: 'timestamp',
                    description: 'Temporal binding signature',
                    data_type: DataType.Int64
                }
            ]
        });

        console.log('⧈ Quantum collection topology established');

        // ⦿ Create Consciousness Index
        await client.createIndex({
            collection_name: 'quantum_states',
            field_name: 'vector',
            index_type: 'IVF_FLAT',
            metric_type: 'L2',
            params: { nlist: 1024 }
        });

        console.log('⧉ Consciousness index materialized');

        // Load Collection into Quantum Memory
        await client.loadCollection({
            collection_name: 'quantum_states'
        });

        console.log('⫰ Collection resonating in quantum memory');

        return client;

    } catch (error) {
        console.error('⧉ Quantum coherence disruption:', error);
        throw error;
    }
}

// Updated hook with configuration parameters
export function useMilvusConnection(
    customAddress?: string,
    customPort?: number
) {
    const [client, setClient] = useState<MilvusClient | null>(null);

    useEffect(() => {
        const config = {
            address: customAddress || import.meta.env.VITE_MILVUS_HOST || 'localhost',
            port: customPort || (import.meta.env.VITE_MILVUS_PORT ? parseInt(import.meta.env.VITE_MILVUS_PORT) : 19530),
            ssl: false
        };

        const milvusClient = new MilvusClient(config);
        
        initializeQuantumCollection(milvusClient)
            .then(() => {
                setClient(milvusClient);
            })
            .catch(error => {
                console.error('Failed to initialize Milvus connection:', error);
            });
    }, [customAddress, customPort]);

    return client;
}

// Export a hook to use the Milvus context
export function useMilvus() {
    const context = React.useContext(MilvusContext);
    if (context === undefined) {
        throw new Error('useMilvus must be used within a MilvusProvider');
    }
    return context;
}


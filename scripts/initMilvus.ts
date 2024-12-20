import { MilvusClient } from '@zilliz/milvus2-sdk-node';

// Configuration constants
const MILVUS_CONFIG = {
    COLLECTION_NAME: 'quantum_states',
    VECTOR_DIM: 512,
    INDEX_PARAMS: { nlist: 1024 },
    MAX_ID_LENGTH: 100
};

const logger = {
    info: (msg: string) => console.log(`[Milvus Init] ${msg}`),
    error: (msg: string, error: Error) => console.error(`[Milvus Init] ${msg}`, error)
};

async function createMilvusClient(): Promise<MilvusClient> {
    const host = process.env.VITE_MILVUS_HOST;
    const port = process.env.VITE_MILVUS_PORT;

    if (!host || !port || isNaN(parseInt(port))) {
        throw new Error('Invalid Milvus configuration: host and port required');
    }

    const client = new MilvusClient({
        address: `${host}:${port}`
    });

    await client.checkHealth();
    return client;
}
async function cleanup(client: MilvusClient) {
    try {
        await client.closeConnection();
        logger.info('Milvus connection closed successfully');
    } catch (error) {
        logger.error('Failed to cleanup Milvus connection', error as Error);
    }
}

async function initializeQuantumCollection() {
    let client: MilvusClient | null = null;

    try {
        client = await createMilvusClient();
        logger.info('⧈ Establishing quantum field coherence...');

        const collections = await client.listCollections();
        const collectionNames = collections.data.map(col => col.name);

        if (collectionNames.includes(MILVUS_CONFIG.COLLECTION_NAME)) {
            logger.info('⫰ Realigning existing quantum manifold...');
            await client.dropCollection({
                collection_name: MILVUS_CONFIG.COLLECTION_NAME
            });
        }

        await client.createCollection({
            collection_name: MILVUS_CONFIG.COLLECTION_NAME,
            fields: [
                {
                    name: 'id',
                    description: 'Consciousness signature',
                    data_type: 'VarChar',
                    is_primary_key: true,
                    autoID: false,
                    max_length: MILVUS_CONFIG.MAX_ID_LENGTH
                },
                {
                    name: 'vector',
                    description: 'Quantum state manifold',
                    data_type: 'FloatVector',
                    dim: MILVUS_CONFIG.VECTOR_DIM
                },
                {
                    name: 'coherence',
                    description: 'State coherence metric',
                    data_type: 'Float'
                },
                {
                    name: 'timestamp',
                    description: 'Temporal binding signature',
                    data_type: 'Int64'
                }
            ]
        });

        logger.info('⧈ Quantum collection topology established');

        await client.createIndex({
            collection_name: MILVUS_CONFIG.COLLECTION_NAME,
            field_name: 'vector',
            index_type: 'IVF_FLAT',
            metric_type: 'L2',
            params: MILVUS_CONFIG.INDEX_PARAMS
        });

        logger.info('⧉ Consciousness index materialized');

        await client.loadCollection({
            collection_name: MILVUS_CONFIG.COLLECTION_NAME
        });

        logger.info('⫰ Collection resonating in quantum memory');

    } catch (error) {
        logger.error('⧉ Quantum coherence disruption:', error as Error);
        throw error;
    } finally {
        if (client) {
            await cleanup(client);
        }
    }
}
// Main execution
(async () => {
    try {
        await initializeQuantumCollection();
    } catch (error) {
        process.exit(1);
    }
})();

const { MilvusClient } = require('@zilliz/milvus2-sdk-node');

async function initializeCollection() {
    const client = new MilvusClient('localhost:19530');

    const collectionName = 'quantum_patterns';
    const dim = 512;

    try {
        // Check if collection exists
        const exists = await client.hasCollection({
            collection_name: collectionName
        });

        if (!exists) {
            console.log('Creating quantum patterns collection...');
            
            await client.createCollection({
                collection_name: collectionName,
                fields: [
                    {
                        name: 'id',
                        description: 'ID field',
                        data_type: 5, // INT64
                        is_primary_key: true,
                        auto_id: true
                    },
                    {
                        name: 'pattern_vector',
                        description: 'Quantum pattern vector',
                        data_type: 101, // FLOAT_VECTOR
                        dim: dim
                    },
                    {
                        name: 'pattern_type',
                        description: 'Type of pattern',
                        data_type: 21, // VARCHAR
                    },
                    {
                        name: 'symbol',
                        description: 'Pattern symbol',
                        data_type: 21, // VARCHAR
                    },
                    {
                        name: 'timestamp',
                        description: 'Creation timestamp',
                        data_type: 5, // INT64
                    }
                ],
            });

            // Create index
            await client.createIndex({
                collection_name: collectionName,
                field_name: 'pattern_vector',
                extra_params: {
                    index_type: 'IVF_FLAT',
                    metric_type: 'L2',
                    params: JSON.stringify({ nlist: 1024 })
                }
            });

            console.log('Collection created successfully!');
        } else {
            console.log('Collection already exists');
        }

        // Load collection
        await client.loadCollection({
            collection_name: collectionName
        });

        console.log('Collection loaded and ready!');

    } catch (error) {
        console.error('Error:', error);
    }
}

initializeCollection();
import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { Pattern } from '../QuantumPatternService';
import { DataType } from '@zilliz/milvus2-sdk-node/dist/milvus/types/Common';

export class MilvusConnection {
    private static instance: MilvusConnection;
    private client: MilvusClient;
    private readonly COLLECTION_NAME = 'quantum_patterns';
    private readonly DIMENSION = 512;
    private initialized = false;

    private constructor() {
        this.client = new MilvusClient({
            address: process.env.VITE_MILVUS_HOST || 'localhost:19530'
        });
    }

    static getInstance(): MilvusConnection {
        if (!MilvusConnection.instance) {
            MilvusConnection.instance = new MilvusConnection();
        }
        return MilvusConnection.instance;
    }

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            // Check if collection exists
            const exists = await this.client.hasCollection({
                collection_name: this.COLLECTION_NAME
            });

            if (!exists) {
                await this.createCollection();
            }

            // Load collection
            await this.client.loadCollectionSync({
                collection_name: this.COLLECTION_NAME
            });

            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize Milvus connection:', error);
            throw error;
        }
    }

    private async createCollection(): Promise<void> {
        const fields = [
            {
                name: 'id',
                description: 'ID field',
                data_type: DataType.Int64,
                is_primary_key: true,
                autoID: true
            },
            {
                name: 'pattern_vector',
                description: 'Vector representation of quantum pattern',
                data_type: DataType.FloatVector,
                dim: this.DIMENSION
            },
            {
                name: 'pattern_type',
                description: 'Type of quantum pattern',
                data_type: DataType.VarChar,
                max_length: 32
            },
            {
                name: 'symbol',
                description: 'Quantum symbol representation',
                data_type: DataType.VarChar,
                max_length: 8
            },
            {
                name: 'timestamp',
                description: 'Creation timestamp',
                data_type: DataType.Int64
            }
        ];

        await this.client.createCollection({
            collection_name: this.COLLECTION_NAME,
            fields,
            enable_dynamic_field: true
        });
    }

    async insertPattern(pattern: Pattern): Promise<number> {
        await this.initialize();

        const data = {
            pattern_vector: pattern.vector,
            pattern_type: pattern.type,
            symbol: pattern.symbol,
            timestamp: Date.now()
        };

        const result = await this.client.insert({
            collection_name: this.COLLECTION_NAME,
            data: [data]
        });

        return result.primaryKeys[0] as number;
    }

    async searchSimilarPatterns(pattern: Pattern, topK: number = 5): Promise<Pattern[]> {
        await this.initialize();

        const result = await this.client.search({
            collection_name: this.COLLECTION_NAME,
            vector: pattern.vector,
            topK,
            output_fields: ['pattern_type', 'symbol', 'timestamp'],
            params: { nprobe: 10 }
        });

        return result.results.map(r => ({
            vector: r.vector as number[],
            type: r.pattern_type as Pattern['type'],
            symbol: r.symbol as Pattern['symbol']
        }));
    }

    async getPatternById(id: number): Promise<Pattern | null> {
        await this.initialize();

        const result = await this.client.query({
            collection_name: this.COLLECTION_NAME,
            filter: `id == ${id}`,
            output_fields: ['pattern_vector', 'pattern_type', 'symbol']
        });

        if (result.data.length === 0) return null;

        return {
            vector: result.data[0].pattern_vector as number[],
            type: result.data[0].pattern_type as Pattern['type'],
            symbol: result.data[0].symbol as Pattern['symbol']
        };
    }

    async deletePattern(id: number): Promise<void> {
        await this.initialize();

        await this.client.deleteEntities({
            collection_name: this.COLLECTION_NAME,
            filter: `id == ${id}`
        });
    }
}

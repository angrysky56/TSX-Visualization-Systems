import { BaseCommand } from './BaseCommand';
import { MilvusConnection } from '../milvus/MilvusConnection';
import { QuantumPatternService, Pattern } from '../QuantumPatternService';

interface CollapseParams {
    targetStates: number[][];
    probability?: number;
}

export class CollapseCommand implements BaseCommand {
    private params: CollapseParams;
    private sourcePattern: Pattern | null = null;
    private collapsedPattern: Pattern | null = null;
    private sourceId: number | null = null;
    private collapsedId: number | null = null;

    constructor(params: CollapseParams) {
        this.params = {
            ...params,
            probability: params.probability || 1.0
        };
    }

    async execute(): Promise<void> {
        try {
            const milvus = MilvusConnection.getInstance();

            // Generate superposition state
            const superposition = this.createSuperposition(this.params.targetStates);
            this.sourcePattern = {
                vector: superposition,
                type: 'quantum',
                symbol: '⧈'
            };

            // Store superposition state
            this.sourceId = await milvus.insertPattern(this.sourcePattern);

            // Perform collapse based on probability
            if (Math.random() < (this.params.probability || 1.0)) {
                // Collapse to one of the target states randomly
                const targetIndex = Math.floor(Math.random() * this.params.targetStates.length);
                const collapsedVector = this.params.targetStates[targetIndex];

                this.collapsedPattern = {
                    vector: this.normalizeVector(collapsedVector),
                    type: 'quantum',
                    symbol: '⦿'
                };

                // Store collapsed state
                this.collapsedId = await milvus.insertPattern(this.collapsedPattern);
            }

        } catch (error) {
            console.error('Error executing CollapseCommand:', error);
            throw error;
        }
    }

    private createSuperposition(states: number[][]): number[] {
        const dim = states[0].length;
        const result = new Array(dim).fill(0);

        // Create equal superposition of all states
        const coefficient = 1 / Math.sqrt(states.length);
        
        for (let i = 0; i < dim; i++) {
            for (const state of states) {
                result[i] += state[i] * coefficient;
            }
        }

        return this.normalizeVector(result);
    }

    private normalizeVector(vector: number[]): number[] {
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return vector.map(val => val / magnitude);
    }

    async undo(): Promise<void> {
        const milvus = MilvusConnection.getInstance();

        // Delete collapsed state if it exists
        if (this.collapsedId !== null) {
            await milvus.deletePattern(this.collapsedId);
            this.collapsedId = null;
            this.collapsedPattern = null;
        }

        // Delete source state
        if (this.sourceId !== null) {
            await milvus.deletePattern(this.sourceId);
            this.sourceId = null;
            this.sourcePattern = null;
        }
    }

    async getState(): Promise<{
        sourcePattern: Pattern | null;
        collapsedPattern: Pattern | null;
        sourceId: number | null;
        collapsedId: number | null;
        visualizationData: number[][][] | null;
    }> {
        return {
            sourcePattern: this.sourcePattern,
            collapsedPattern: this.collapsedPattern,
            sourceId: this.sourceId,
            collapsedId: this.collapsedId,
            visualizationData: this.collapsedPattern 
                ? QuantumPatternService.vectorTo8x8x8Cube(this.collapsedPattern.vector)
                : null
        };
    }
}

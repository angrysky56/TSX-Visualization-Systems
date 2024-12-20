import { BaseCommand } from './BaseCommand';
import { MilvusConnection } from '../milvus/MilvusConnection';
import { QuantumPatternService, Pattern } from '../QuantumPatternService';

interface EvolveCommandParams {
    timeScale: number;
    phase: number;
    sourcePatternId?: number;
}

export class EvolveCommand implements BaseCommand {
    private params: EvolveCommandParams;
    private sourcePattern: Pattern | null = null;
    private evolvedPattern: Pattern | null = null;
    private patternId: number | null = null;
    private readonly PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio

    constructor(params: EvolveCommandParams) {
        this.params = params;
    }

    async execute(): Promise<void> {
        try {
            const milvus = MilvusConnection.getInstance();

            // Get source pattern
            if (this.params.sourcePatternId) {
                this.sourcePattern = await milvus.getPatternById(this.params.sourcePatternId);
            }

            if (!this.sourcePattern) {
                throw new Error('No source pattern found for evolution');
            }

            // Apply evolution transformation
            const evolvedVector = this.evolveVector(
                this.sourcePattern.vector,
                this.params.timeScale,
                this.params.phase
            );

            this.evolvedPattern = {
                vector: evolvedVector,
                type: this.sourcePattern.type,
                symbol: this.sourcePattern.symbol
            };

            // Store evolved pattern
            this.patternId = await milvus.insertPattern(this.evolvedPattern);

        } catch (error) {
            console.error('Error executing EvolveCommand:', error);
            throw error;
        }
    }

    private evolveVector(vector: number[], timeScale: number, phase: number): number[] {
        const evolved = new Array(vector.length);
        const t = timeScale;

        for (let i = 0; i < vector.length; i++) {
            // Apply quantum evolution using Fibonacci sequence and golden ratio
            const fibPhase = (i * Math.PI * this.PHI) % (2 * Math.PI);
            const evolutionFactor = Math.cos(fibPhase + phase) * t;
            
            // Complex rotation in phase space
            evolved[i] = vector[i] * Math.cos(evolutionFactor) + 
                        (vector[(i + 1) % vector.length] * Math.sin(evolutionFactor));
        }

        // Normalize the evolved vector
        const magnitude = Math.sqrt(evolved.reduce((sum, val) => sum + val * val, 0));
        return evolved.map(val => val / magnitude);
    }

    async undo(): Promise<void> {
        if (this.patternId !== null) {
            try {
                const milvus = MilvusConnection.getInstance();
                await milvus.deletePattern(this.patternId);
                this.patternId = null;
                this.evolvedPattern = null;
            } catch (error) {
                console.error('Error undoing EvolveCommand:', error);
                throw error;
            }
        }
    }

    async getState(): Promise<{
        sourcePattern: Pattern | null;
        evolvedPattern: Pattern | null;
        patternId: number | null;
        visualizationData: number[][][] | null;
        evolutionPhase: number;
    }> {
        return {
            sourcePattern: this.sourcePattern,
            evolvedPattern: this.evolvedPattern,
            patternId: this.patternId,
            visualizationData: this.evolvedPattern 
                ? QuantumPatternService.vectorTo8x8x8Cube(this.evolvedPattern.vector)
                : null,
            evolutionPhase: this.params.phase
        };
    }
}

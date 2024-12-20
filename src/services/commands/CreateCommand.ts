import { BaseCommand } from './BaseCommand';
import { MilvusConnection } from '../milvus/MilvusConnection';
import { QuantumPatternService, Pattern } from '../QuantumPatternService';

interface CreateCommandParams {
    patternType: string;
    symbol: string;
    phase: number;
}

export class CreateCommand implements BaseCommand {
    private params: CreateCommandParams;
    private createdPattern: Pattern | null = null;
    private patternId: number | null = null;

    constructor(params: CreateCommandParams) {
        this.params = params;
    }

    async execute(): Promise<void> {
        try {
            // Generate the quantum pattern
            this.createdPattern = await QuantumPatternService.generatePattern(
                this.params.patternType,
                this.params.symbol,
                this.params.phase
            );

            // Store in Milvus
            if (this.createdPattern) {
                const milvus = MilvusConnection.getInstance();
                this.patternId = await milvus.insertPattern(this.createdPattern);
            }
        } catch (error) {
            console.error('Error executing CreateCommand:', error);
            throw error;
        }
    }

    async undo(): Promise<void> {
        if (this.patternId !== null) {
            try {
                const milvus = MilvusConnection.getInstance();
                await milvus.deletePattern(this.patternId);
                this.patternId = null;
                this.createdPattern = null;
            } catch (error) {
                console.error('Error undoing CreateCommand:', error);
                throw error;
            }
        }
    }

    async getState(): Promise<{
        pattern: Pattern | null;
        patternId: number | null;
        visualizationData: number[][][] | null;
    }> {
        if (!this.createdPattern) {
            return { pattern: null, patternId: null, visualizationData: null };
        }

        return {
            pattern: this.createdPattern,
            patternId: this.patternId,
            visualizationData: QuantumPatternService.vectorTo8x8x8Cube(this.createdPattern.vector)
        };
    }
}

import { BaseCommand } from './BaseCommand';
import { MilvusConnection } from '../milvus/MilvusConnection';
import { QuantumPatternService, Pattern } from '../QuantumPatternService';

interface MergeCommandParams {
    targetStates: number[][];
    phase?: number;
    resonanceSymbols?: string[];
}

export class MergeCommand implements BaseCommand {
    private params: MergeCommandParams;
    private mergedPattern: Pattern | null = null;
    private patternId: number | null = null;
    private sourcePatternIds: number[] = [];

    constructor(params: MergeCommandParams) {
        this.params = params;
    }

    async execute(): Promise<void> {
        try {
            const milvus = MilvusConnection.getInstance();

            // Convert target states to patterns
            const patterns: Pattern[] = [];
            for (let i = 0; i < this.params.targetStates.length; i++) {
                const vector = this.params.targetStates[i];
                const symbol = this.params.resonanceSymbols?.[i] || '⦿';
                
                const pattern: Pattern = {
                    vector,
                    type: 'quantum', // Default type for merged patterns
                    symbol: symbol
                };

                // Store intermediate patterns
                const patternId = await milvus.insertPattern(pattern);
                this.sourcePatternIds.push(patternId);
                patterns.push(pattern);
            }

            // Merge patterns using quantum superposition
            let mergedPattern = patterns[0];
            for (let i = 1; i < patterns.length; i++) {
                mergedPattern = QuantumPatternService.mergePatterns(
                    mergedPattern,
                    patterns[i],
                    this.params.phase || Math.PI / 4
                );
            }

            this.mergedPattern = mergedPattern;
            this.patternId = await milvus.insertPattern(mergedPattern);

        } catch (error) {
            console.error('Error executing MergeCommand:', error);
            throw error;
        }
    }

    async undo(): Promise<void> {
        const milvus = MilvusConnection.getInstance();
        
        // Delete the merged pattern
        if (this.patternId !== null) {
            await milvus.deletePattern(this.patternId);
            this.patternId = null;
        }

        // Delete source patterns
        for (const id of this.sourcePatternIds) {
            await milvus.deletePattern(id);
        }
        this.sourcePatternIds = [];
        this.mergedPattern = null;
    }

    async getState(): Promise<{
        pattern: Pattern | null;
        patternId: number | null;
        visualizationData: number[][][] | null;
        sourcePatternIds: number[];
    }> {
        return {
            pattern: this.mergedPattern,
            patternId: this.patternId,
            visualizationData: this.mergedPattern 
                ? QuantumPatternService.vectorTo8x8x8Cube(this.mergedPattern.vector)
                : null,
            sourcePatternIds: this.sourcePatternIds
        };
    }
}

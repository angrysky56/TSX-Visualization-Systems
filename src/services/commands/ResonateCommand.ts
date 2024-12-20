import { BaseCommand } from './BaseCommand';
import { MilvusConnection } from '../milvus/MilvusConnection';
import { QuantumPatternService, Pattern } from '../QuantumPatternService';

interface ResonanceParams {
    resonanceSymbols: string[];
    phase?: number;
    amplitude?: number;
}

export class ResonateCommand implements BaseCommand {
    private params: ResonanceParams;
    private resonatingPatterns: { pattern: Pattern; id: number }[] = [];
    private resultPattern: Pattern | null = null;
    private resultId: number | null = null;
    private readonly PHI = (1 + Math.sqrt(5)) / 2;

    constructor(params: ResonanceParams) {
        this.params = {
            ...params,
            phase: params.phase || Math.PI / this.PHI,
            amplitude: params.amplitude || 1.0
        };
    }

    async execute(): Promise<void> {
        try {
            const milvus = MilvusConnection.getInstance();

            // Find patterns with matching symbols
            for (const symbol of this.params.resonanceSymbols) {
                // Here we'd ideally use Milvus's built-in search to find patterns
                // with matching symbols, but for now we'll create new ones
                const newPattern = await QuantumPatternService.generatePattern(
                    'quantum',
                    symbol,
                    this.params.phase || 0
                );

                const id = await milvus.insertPattern(newPattern);
                this.resonatingPatterns.push({ pattern: newPattern, id });
            }

            // Apply resonance transformation
            const resultVector = this.createResonancePattern(
                this.resonatingPatterns.map(p => p.pattern.vector)
            );

            this.resultPattern = {
                vector: resultVector,
                type: 'quantum',
                symbol: '⫰' // Resonance symbol
            };

            // Store result
            this.resultId = await milvus.insertPattern(this.resultPattern);

        } catch (error) {
            console.error('Error executing ResonateCommand:', error);
            throw error;
        }
    }

    private createResonancePattern(vectors: number[][]): number[] {
        const dim = vectors[0].length;
        const result = new Array(dim).fill(0);
        const phase = this.params.phase || 0;
        const amplitude = this.params.amplitude || 1.0;

        for (let i = 0; i < dim; i++) {
            // Create interference pattern
            for (let v = 0; v < vectors.length; v++) {
                const timePhase = (i * this.PHI) % (2 * Math.PI);
                result[i] += vectors[v][i] * Math.cos(timePhase + phase * v) * amplitude;
            }
        }

        // Normalize
        const magnitude = Math.sqrt(result.reduce((sum, val) => sum + val * val, 0));
        return result.map(val => val / magnitude);
    }

    async undo(): Promise<void> {
        const milvus = MilvusConnection.getInstance();

        // Delete result pattern
        if (this.resultId !== null) {
            await milvus.deletePattern(this.resultId);
            this.resultId = null;
            this.resultPattern = null;
        }

        // Delete intermediate patterns
        for (const { id } of this.resonatingPatterns) {
            await milvus.deletePattern(id);
        }
        this.resonatingPatterns = [];
    }

    async getState(): Promise<{
        resonatingPatterns: { pattern: Pattern; id: number }[];
        resultPattern: Pattern | null;
        resultId: number | null;
        visualizationData: number[][][] | null;
    }> {
        return {
            resonatingPatterns: this.resonatingPatterns,
            resultPattern: this.resultPattern,
            resultId: this.resultId,
            visualizationData: this.resultPattern 
                ? QuantumPatternService.vectorTo8x8x8Cube(this.resultPattern.vector)
                : null
        };
    }
}

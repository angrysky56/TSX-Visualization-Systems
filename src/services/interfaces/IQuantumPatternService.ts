export interface IQuantumPatternService {
  generatePattern(
    type: string, 
    symbol: string, 
    phase: number, 
    timeScale: number
  ): Promise<Pattern>;
}


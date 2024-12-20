// Base interface for optional parameters
interface BaseOptionalParams {
    timeScale?: number;
    amplitude?: number;
    probability?: number;
}

// Base interface for required parameters
interface BaseRequiredParams extends BaseOptionalParams {
    symbol: string;
    phase?: number;
}

export interface CreateCommandParams extends BaseRequiredParams {
    patternType: string;
    targetStates?: Array<any>;  // Add targetStates directly to CreateCommandParams
    resonanceSymbols?: Array<string>;
}

export interface MergeCommandParams extends BaseRequiredParams {
    sourceStates: number[][];
    mergeStrategy: string;
}

export interface EvolveCommandParams extends BaseRequiredParams {
    evolutionRate: number;
    targetStates: number[][];
}

export interface ResonateCommandParams extends BaseRequiredParams {
    resonanceFrequency: number;
    resonanceSymbols?: string[];
}

export interface CollapseCommandParams extends BaseRequiredParams {
    collapseThreshold: number;
    targetState: number[];
}

export type CommandParams = 
    | CreateCommandParams 
    | MergeCommandParams 
    | EvolveCommandParams 
    | ResonateCommandParams 
    | CollapseCommandParams;

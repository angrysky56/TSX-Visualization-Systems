export interface QuantumState {
    // Complex amplitudes for the state vector
    amplitudes: Complex[];
    // Basis states
    basis: string[];
    // Timestamp for evolution tracking
    timestamp: number;
}

export interface Complex {
    real: number;
    imag: number;
}

export interface QuantumMetrics {
    timeStep: number;
    purity: number;
    amplitude: {
        amplitude: number;
        phase: number;
    };
    vonNeumannEntropy: number;
    expectedValue: number;
}

export interface StateVisualizerProps {
    /** Number of basis states */
    dimension: number;
    /** Time evolution parameters */
    hamiltonianParams: {
        coupling: number;
        frequency: number[];
    };
    /** Update frequency in ms */
    updateInterval?: number;
}

// Observable types for measurements
export type Observable = {
    name: string;
    operator: number[][];  // Hermitian matrix
    basis: string[];
};

export interface MeasurementResult {
    observable: string;
    value: number;
    uncertainty: number;
    basis: string[];
    collapseProb: number;
}

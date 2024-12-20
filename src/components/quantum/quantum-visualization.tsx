/**
 * Quantum State Visualization System
 * 
 * A framework for visualizing quantum state evolution and measurements
 * 
 * Mathematical Framework:
 * 
 * 1. Quantum State Evolution:
 *    |ψ(t)⟩ = exp(-iHt/ħ)|ψ(0)⟩
 *    where:
 *    - H: Hamiltonian operator
 *    - ħ: reduced Planck constant
 *    - t: time parameter
 * 
 * 2. State Purity:
 *    P = Tr(ρ²)
 *    where ρ is the density matrix
 * 
 * 3. Von Neumann Entropy:
 *    S = -Tr(ρ ln ρ)
 * 
 * 4. Expectation Values:
 *    ⟨A⟩ = ⟨ψ|A|ψ⟩
 *    where A is an observable operator
 */

import React, { useEffect, useState, useMemo } from 'react';
import { 
    Line, 
    ResponsiveContainer, 
    LineChart, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend 
} from 'recharts';
import { useQuantumState } from '../../hooks/useQuantumState';
import { Complex, QuantumMetrics, StateVisualizerProps } from '../../types/quantum';
import { calculateDensityMatrix, matrixMultiply, matrixLogarithm, trace } from '../../utils/quantum-math';

/**
 * Calculates the magnitude of a complex number
 */
const magnitude = (c: Complex): number => 
    Math.sqrt(c.real * c.real + c.imag * c.imag);

/**
 * Calculates the phase of a complex number
 */
const phase = (c: Complex): number => 
    Math.atan2(c.imag, c.real);

/**
 * Calculates the von Neumann entropy of the quantum state
 */
const calculateVonNeumannEntropy = (amplitudes: Complex[]): number => {
    const densityMatrix = calculateDensityMatrix(amplitudes);
    return -trace(matrixMultiply(densityMatrix, matrixLogarithm(densityMatrix)));
};

/**
 * Calculates expected values for relevant observables
 */
const calculateExpectedValues = (amplitudes: Complex[]): number[] => {
    const densityMatrix = calculateDensityMatrix(amplitudes);
    // Calculate expectation values for standard observables (σx, σy, σz for qubits)
    // This implementation assumes a qubit system - extend for higher dimensions
    return amplitudes.map((_, index) => {
        const observable = getObservableOperator(index);
        return trace(matrixMultiply(densityMatrix, observable));
    });
};

/**
 * Calculates the purity of the quantum state
 */
const calculatePurity = (amplitudes: Complex[]): number => {
    const densityMatrix = calculateDensityMatrix(amplitudes);
    return trace(matrixMultiply(densityMatrix, densityMatrix));
};

/**
 * Quantum State Visualization Component
 */
const QuantumVisualizer: React.FC<StateVisualizerProps> = ({
    dimension,
    hamiltonianParams,
    updateInterval = 100
}) => {
    const { quantumState, measurementResults } = useQuantumState(dimension, hamiltonianParams);
    const [visualData, setVisualData] = useState<QuantumMetrics[]>([]);

    // Transform quantum state to visualization metrics
    useEffect(() => {
        if (!quantumState?.amplitudes) return;

        const newMetrics: QuantumMetrics = {
            timeStep: quantumState.timestamp,
            purity: calculatePurity(quantumState.amplitudes),
            amplitudes: quantumState.amplitudes.map(magnitude),
            phases: quantumState.amplitudes.map(phase),
            vonNeumannEntropy: calculateVonNeumannEntropy(quantumState.amplitudes),
            expectedValues: calculateExpectedValues(quantumState.amplitudes)
        };

        setVisualData(prev => [...prev, newMetrics].slice(-50));
    }, [quantumState]);

    // Memoize chart configuration
    const chartConfig = useMemo(() => ({
        amplitudeLine: {
            type: "monotone" as const,
            stroke: "#4299E1",
            strokeWidth: 2
        },
        phaseLine: {
            type: "monotone" as const,
            stroke: "#48BB78",
            strokeWidth: 2
        }
    }), []);

    return (
        <div className="w-full h-full bg-gray-900 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-400 mb-4">
                Quantum State Evolution
            </h2>
            
            {/* State Vector Evolution Plot */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={visualData}>
                    <XAxis 
                        dataKey="timeStep"
                        label={{ value: 'Time Evolution (t)', position: 'bottom' }}
                        stroke="#718096"
                    />
                    <YAxis 
                        label={{ 
                            value: 'Amplitude', 
                            angle: -90, 
                            position: 'left' 
                        }}
                        stroke="#718096"
                    />
                    <Tooltip 
                        content={({ active, payload }) => (
                            active && payload ? (
                                <div className="bg-gray-800 p-2 rounded">
                                    <p className="text-blue-400">
                                        |ψ| = {payload[0].value?.toFixed(4)}
                                    </p>
                                    <p className="text-green-400">
                                        arg(ψ) = {payload[1].value?.toFixed(4)} rad
                                    </p>
                                </div>
                            ) : null
                        )}
                    />
                    <Line 
                        {...chartConfig.amplitudeLine}
                        dataKey="amplitudes[0]"
                        dot={false}
                        name="State Amplitude"
                    />
                    <Line 
                        {...chartConfig.phaseLine}
                        dataKey="phases[0]"
                        dot={false}
                        name="State Phase"
                    />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>

            {/* Measurement Results Display */}
            <div className="mt-4 grid grid-cols-3 gap-4">
                {measurementResults.map(result => (
                    <MetricCard
                        key={result.observable}
                        title={`⟨${result.observable}⟩`}
                        value={result.value}
                        uncertainty={result.uncertainty}
                        basis={result.basis.join(', ')}
                    />
                ))}
            </div>

            {/* System Parameters */}
            <div className="mt-4 text-sm text-gray-500">
                <div>Dimension (n): {dimension}</div>
                <div>Coupling (g): {hamiltonianParams.coupling}</div>
                <div>Update Rate (δt): {updateInterval}ms</div>
            </div>
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value: number;
    uncertainty: number;
    basis: string;
}

/**
 * Measurement Result Display Card
 */
const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value,
    uncertainty,
    basis
}) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-white">
            {value.toFixed(4)} ± {uncertainty.toFixed(4)}
        </p>
        <div className="text-xs text-gray-500 mt-1">
            Basis: {basis}
        </div>
    </div>
);

export default QuantumVisualizer;
import { useState, useEffect } from 'react';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { Complex, QuantumState, MeasurementResult } from '../types/quantum';

// Efficiently encode quantum states into vector space
const encodeQuantumState = (amplitudes: Complex[]): number[] => {
    // Flatten complex numbers into real vector for Milvus
    return amplitudes.flatMap(amp => [amp.real, amp.imag]);
};

// Decode Milvus vectors back into quantum states
const decodeQuantumState = (vector: number[]): Complex[] => {
    const amplitudes: Complex[] = [];
    for (let i = 0; i < vector.length; i += 2) {
        amplitudes.push({
            real: vector[i],
            imag: vector[i + 1]
        });
    }
    return amplitudes;
};

/**
 * Uses Milvus to track quantum state evolution through similar states
 * rather than computing full matrix operations
 */
export const useQuantumState = (
    dimension: number,
    hamiltonianParams: {
        coupling: number;
        frequency: number[];
    },
    updateInterval: number = 100
) => {
    const [milvusClient] = useState(() => new MilvusClient({
        address: "localhost:19530"
    }));

    const [quantumState, setQuantumState] = useState<QuantumState>({
        amplitudes: Array(dimension).fill({ real: 0, imag: 0 }),
        basis: Array(dimension).fill('').map((_, i) => `|${i}⟩`),
        timestamp: 0
    });

    const [measurementResults, setMeasurementResults] = useState<MeasurementResult[]>([]);

    // Initialize collection if needed
    useEffect(() => {
        const initMilvus = async () => {
            const collectionName = 'quantum_states';
            
            // Check if collection exists
            const exists = await milvusClient.hasCollection({
                collection_name: collectionName
            });

            if (!exists) {
                // Create collection for quantum states
                await milvusClient.createCollection({
                    collection_name: collectionName,
                    dimension: dimension * 2, // Complex numbers need 2 dimensions each
                    metric_type: 'L2'
                });
            }
        };

        initMilvus();
    }, [dimension, milvusClient]);

    // Handle state evolution using Milvus
    useEffect(() => {
        const evolveState = async () => {
            const currentVector = encodeQuantumState(quantumState.amplitudes);

            // Search for similar states in Milvus
            const searchResult = await milvusClient.search({
                collection_name: 'quantum_states',
                vector: currentVector,
                limit: 5,
                metric_type: 'L2'
            });

            if (searchResult.results.length > 0) {
                // Use the most similar state as basis for evolution
                const nextState = decodeQuantumState(searchResult.results[0].vector);
                
                // Apply small random perturbation to simulate evolution
                const evolved = nextState.map(amp => ({
                    real: amp.real + (Math.random() - 0.5) * 0.1,
                    imag: amp.imag + (Math.random() - 0.5) * 0.1
                }));

                // Normalize
                const norm = Math.sqrt(evolved.reduce((sum, amp) => 
                    sum + amp.real * amp.real + amp.imag * amp.imag, 0
                ));
                
                const normalized = evolved.map(amp => ({
                    real: amp.real / norm,
                    imag: amp.imag / norm
                }));

                // Store new state in Milvus
                await milvusClient.insert({
                    collection_name: 'quantum_states',
                    data: [encodeQuantumState(normalized)]
                });

                setQuantumState(prev => ({
                    ...prev,
                    amplitudes: normalized,
                    timestamp: prev.timestamp + updateInterval
                }));

                // Calculate simple measurement result
                const measurementValue = normalized.reduce((sum, amp, idx) => 
                    sum + (amp.real * amp.real + amp.imag * amp.imag) * idx, 
                0);

                setMeasurementResults([{
                    observable: 'Energy',
                    value: measurementValue,
                    uncertainty: Math.sqrt(measurementValue),
                    basis: quantumState.basis,
                    collapseProb: Math.random()
                }]);
            }
        };

        const interval = setInterval(evolveState, updateInterval);
        return () => clearInterval(interval);
    }, [quantumState, dimension, updateInterval, milvusClient]);

    return { quantumState, measurementResults };
};

import { useState, useCallback } from 'react';
import { logger } from '@/lib/utils/logger';
import { CONFIG } from '@/lib/constants/config';

export interface QuantumState {
  vector: number[];
  coherence: number;
  phase: number;
}

export const useQuantumState = (initialState?: QuantumState) => {
  const [state, setState] = useState<QuantumState>(initialState || {
    vector: new Array(CONFIG.QUANTUM_DIMENSIONS).fill(0),
    coherence: 1.0,
    phase: 0
  });

  const updateState = useCallback((newState: Partial<QuantumState>) => {
    setState(prevState => {
      const updatedState = { ...prevState, ...newState };
      if (updatedState.coherence < CONFIG.DEFAULT_COHERENCE_THRESHOLD) {
        logger.warn('Quantum state coherence below threshold');
      }
      return updatedState;
    });
  }, []);

  return {
    state,
    updateState
  };
};
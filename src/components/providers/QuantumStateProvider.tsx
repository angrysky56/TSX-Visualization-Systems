import React, { createContext, useContext, ReactNode } from 'react';
import { useQuantumState, QuantumState } from '@/lib/hooks/useQuantumState';
import { handleError } from '@/lib/utils/errorHandler';

interface QuantumStateContextType {
  state: QuantumState;
  updateState: (newState: Partial<QuantumState>) => void;
}

const QuantumStateContext = createContext<QuantumStateContextType | undefined>(undefined);

export const useQuantumStateContext = () => {
  const context = useContext(QuantumStateContext);
  if (!context) {
    throw new Error('useQuantumStateContext must be used within a QuantumStateProvider');
  }
  return context;
};

interface QuantumStateProviderProps {
  children: ReactNode;
  initialState?: QuantumState;
}

export const QuantumStateProvider: React.FC<QuantumStateProviderProps> = ({
  children,
  initialState
}) => {
  const { state, updateState } = useQuantumState(initialState);

  return (
    <QuantumStateContext.Provider
      value={{
        state,
        updateState
      }}
    >
      {children}
    </QuantumStateContext.Provider>
  );
};
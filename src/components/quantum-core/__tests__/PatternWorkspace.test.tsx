import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PatternWorkspace } from '../PatternWorkspace';
import { QuantumPatternService } from '../../../services/quantumPatternService';

// Mock the QuantumPatternService
jest.mock('../../../services/quantumPatternService');

// Mock the PatternVisualizer component
jest.mock('../../quantum/PatternVisualizer', () => ({
  PatternVisualizer: ({ pattern }: { pattern: any }) => (
    <div data-testid="pattern-visualizer">{JSON.stringify(pattern)}</div>
  ),
}));

describe('PatternWorkspace', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (QuantumPatternService.generatePattern as jest.Mock).mockReturnValue({
      id: 'test-pattern',
      type: 'quantum',
      data: []
    });
    
    (QuantumPatternService.mergePatterns as jest.Mock).mockReturnValue({
      id: 'merged-pattern',
      type: 'quantum',
      data: []
    });
  });

  test('renders initial state correctly', () => {
    render(<PatternWorkspace />);
    
    expect(screen.getByText('Pattern Generation')).toBeInTheDocument();
    expect(screen.getByText('Pattern Visualization')).toBeInTheDocument();
    expect(screen.getByText('Generate a pattern to visualize')).toBeInTheDocument();
  });

  test('generates new pattern when button is clicked', () => {
    render(<PatternWorkspace />);
    
    const generateButton = screen.getByText('Generate Pattern');
    fireEvent.click(generateButton);
    
    expect(QuantumPatternService.generatePattern).toHaveBeenCalled();
    expect(screen.getByTestId('pattern-visualizer')).toBeInTheDocument();
  });

  test('updates pattern type when selection changes', () => {
    render(<PatternWorkspace />);
    
    const patternTypeSelect = screen.getByText('Quantum');
    fireEvent.click(patternTypeSelect);
    
    const dreamOption = screen.getByText('Dream');
    fireEvent.click(dreamOption);
    
    expect(QuantumPatternService.generatePattern).toHaveBeenCalledWith('dream', expect.any(String));
  });

  test('handles merge pattern generation and merging', async () => {
    render(<PatternWorkspace />);
    
    // Generate initial pattern
    fireEvent.click(screen.getByText('Generate Pattern'));
    
    // Generate merge pattern
    const generateMergeButton = screen.getByText('Generate Merge Pattern');
    fireEvent.click(generateMergeButton);
    
    // Perform merge
    const mergeButton = screen.getByText('Merge Patterns');
    fireEvent.click(mergeButton);
    
    expect(QuantumPatternService.mergePatterns).toHaveBeenCalled();
  });

  test('updates phase shift when slider changes', () => {
    render(<PatternWorkspace />);
    
    // Generate initial pattern to show merge controls
    fireEvent.click(screen.getByText('Generate Pattern'));
    
    const phaseShiftSlider = screen.getByRole('slider');
    fireEvent.change(phaseShiftSlider, { target: { value: Math.PI / 2 } });
    
    expect(phaseShiftSlider).toHaveValue(String(Math.PI / 2));
  });

  test('merge button is disabled when no merge pattern exists', () => {
    render(<PatternWorkspace />);
    
    // Generate initial pattern
    fireEvent.click(screen.getByText('Generate Pattern'));
    
    const mergeButton = screen.getByText('Merge Patterns');
    expect(mergeButton).toBeDisabled();
  });

  test('quantum symbol selection updates pattern generation', () => {
    render(<PatternWorkspace />);
    
    const symbolSelect = screen.getByText('⦿');
    fireEvent.click(symbolSelect);
    
    const newSymbol = screen.getByText('⧈');
    fireEvent.click(newSymbol);
    
    expect(QuantumPatternService.generatePattern).toHaveBeenCalledWith(expect.any(String), '⧈');
  });
});

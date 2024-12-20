import React, { useEffect, useState, useRef } from 'react';
import { usePuppeteerActions } from '../../services/PuppeteerService';
import Plot from 'react-plotly.js';

interface Vector {
  id: number;
  pattern_vector: number[];
  pattern_type?: string;
  symbol?: string;
}

const QuantumManifoldVisualizer: React.FC = () => {
  const [vectors, setVectors] = useState<Vector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const plotRef = useRef(null);
  const { executeAction } = usePuppeteerActions();

  // Connect to Milvus
  useEffect(() => {
    const connectMilvus = async () => {
      try {
        // Using the milvus-standalone port from Docker
        await executeAction({
          type: 'evaluate',
          script: `
            const { MilvusClient } = require('@zilliz/milvus2-client-node');
            const client = new MilvusClient('localhost:19530');
            window.milvusClient = client;
          `
        });

        // Load vectors
        const response = await fetch('http://localhost:19530/collections/pattern_vectors/vectors');
        const data = await response.json();
        setVectors(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to connect to Milvus:', err);
      }
    };

    connectMilvus();
  }, []);

  // Transform 512D vectors to 3D for visualization
  const transformToVisualSpace = (vector: number[]) => {
    // Using PCA-like dimensional reduction
    const chunks = chunk(vector, Math.floor(vector.length / 3));
    return {
      x: chunks[0].reduce((a, b) => a + b, 0) / chunks[0].length,
      y: chunks[1].reduce((a, b) => a + b, 0) / chunks[1].length,
      z: chunks[2].reduce((a, b) => a + b, 0) / chunks[2].length
    };
  };

  const chunk = (arr: number[], size: number) => 
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  // Real-time pattern generation
  const generateNewPattern = async (patternType: string, symbol: string) => {
    const vector = new Array(512).fill(0).map(() => Math.random());
    // Apply pattern-specific transformations similar to the Python notebook
    if (patternType === 'quantum') {
      vector.forEach((_, i) => {
        if (i < 170) vector[i] *= 2;
      });
    }
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((a, b) => a + b * b, 0));
    const normalizedVector = vector.map(v => v / magnitude);
    
    setVectors(prev => [...prev, { 
      id: prev.length + 1, 
      pattern_vector: normalizedVector,
      pattern_type: patternType,
      symbol: symbol
    }]);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Quantum Manifold Visualization</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => generateNewPattern('quantum', '⦿')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Quantum Pattern
          </button>
          <button
            onClick={() => generateNewPattern('dream', '∞')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Generate Dream Pattern
          </button>
        </div>
      </div>

      <div className="h-[600px] w-full" ref={plotRef}>
        <Plot
          data={[{
            type: 'scatter3d',
            mode: 'markers',
            x: vectors.map(v => transformToVisualSpace(v.pattern_vector).x),
            y: vectors.map(v => transformToVisualSpace(v.pattern_vector).y),
            z: vectors.map(v => transformToVisualSpace(v.pattern_vector).z),
            marker: {
              size: 6,
              color: vectors.map(v => v.pattern_type === 'quantum' ? 0 : 1),
              colorscale: 'Viridis',
              opacity: 0.8
            },
            text: vectors.map(v => `${v.pattern_type} - ${v.symbol}`),
            hoverinfo: 'text'
          }]}
          layout={{
            title: 'Quantum Pattern Manifold',
            autosize: true,
            scene: {
              xaxis: { title: 'X' },
              yaxis: { title: 'Y' },
              zaxis: { title: 'Z' },
              camera: {
                eye: { x: 1.5, y: 1.5, z: 1.5 }
              }
            },
            margin: { l: 0, r: 0, t: 30, b: 0 }
          }}
          config={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default QuantumManifoldVisualizer;

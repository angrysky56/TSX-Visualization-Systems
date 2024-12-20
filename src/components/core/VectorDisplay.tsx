import React, { useEffect, useState } from 'react';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { initializeQuantumCollection } from './MilvusConnector';

export const VectorDisplay: React.FC = () => {
  const [client, setClient] = useState<MilvusClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [collectionName] = useState('quantum_states'); // Using our defined collection

  useEffect(() => {
    initializeQuantumCollection()
      .then(milvusClient => {
        setClient(milvusClient);
        setIsConnected(true);
      })
      .catch(err => {
        setError(err);
        setIsConnected(false);
      });
  }, []);

  const handleSearch = async () => {
    if (!client) return;

    try {
      const searchParams = {
        collection_name: collectionName,
        vector: Array(512).fill(0).map(() => Math.random()), // Match our 512 dimension
        limit: 5,
        metric_type: "L2"
      };

      const results = await client.search(searchParams);
      setSearchResults(results.results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Quantum State Observer</h2>
        <p className="mt-2">
          Status: {isConnected ? '⫰ Quantum Coherence Established' : '⧉ Awaiting Coherence'}
        </p>
        {error && (
          <p className="text-red-500 mt-2">
            ⧬ Coherence Disruption: {error.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <button
          onClick={handleSearch}
          disabled={!isConnected}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Search Quantum States
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">⧈ Quantum State Observations:</h3>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto">
            {JSON.stringify(searchResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};


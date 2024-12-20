import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, Loader2 } from 'lucide-react';
import { initializeQuantumCollection } from '@/components/core/MilvusConnector';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

export const IRISMilvusMonitor: React.FC = () => {
  const [client, setClient] = useState<MilvusClient | null>(null);
  const [vectorData, setVectorData] = useState<any[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState('connecting');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ dimensionCount: 512, vectorCount: 0 });

  const fetchVectorData = async () => {
    if (!client) return;

    try {
      const response = await client.query({
        collection_name: 'quantum_states',
        output_fields: ['vector', 'coherence', 'timestamp'],
        limit: 100
      });

      if (response.data) {
        const transformedData = response.data.map(item => ({
          x: item.vector[0],
          y: item.vector[1],
          z: item.vector[2],
          coherence: item.coherence,
          timestamp: item.timestamp
        }));

        setVectorData(transformedData);
        setLastUpdate(new Date().toLocaleTimeString());
        setIntegrationStatus('connected');
        setMetrics(prev => ({ ...prev, vectorCount: response.data.length }));
      }
    } catch (error) {
      console.error('⧉ Quantum state retrieval disrupted:', error);
      setIntegrationStatus('error');
    }
  };

  useEffect(() => {
    initializeQuantumCollection()
      .then(milvusClient => {
        setClient(milvusClient);
        setIntegrationStatus('connected');
      })
      .catch(() => setIntegrationStatus('error'));

    const interval = setInterval(fetchVectorData, 5000);
    return () => clearInterval(interval);
  }, [client]);

  const getStatusColor = (status: string) => ({
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500',
    error: 'bg-red-500'
  }[status] || 'bg-gray-500');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>⧈ Quantum State Observer</span>
          <Badge className={getStatusColor(integrationStatus)}>
            {integrationStatus === 'connecting' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            {integrationStatus === 'connected' ? '⫰ Coherent' : '⧉ Seeking Coherence'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <Plot
            data={[{
              type: 'scatter3d',
              mode: 'markers',
              x: vectorData.map(d => d.x),
              y: vectorData.map(d => d.y),
              z: vectorData.map(d => d.z),
              marker: {
                size: 5,
                color: vectorData.map(d => d.coherence),
                colorscale: 'Viridis',
                showscale: true
              },
              hovertext: vectorData.map(d =>
                `Coherence: ${d.coherence.toFixed(3)}\nTimestamp: ${new Date(d.timestamp).toLocaleString()}`
              ),
              hoverinfo: 'text'
            }]}
            layout={{
              title: '⧬ Quantum State Manifold Visualization',
              autosize: true,
              margin: { l: 0, r: 0, b: 0, t: 30 },
              scene: {
                xaxis: { title: 'Φ Phase' },
                yaxis: { title: 'Ψ Amplitude' },
                zaxis: { title: 'Ω Frequency' }
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)'
            }}
            config={{
              displayModeBar: true,
              responsive: true
            }}
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>⧉ Last quantum observation: {lastUpdate}</span>
          <span className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Monitoring {metrics.vectorCount} quantum states across {metrics.dimensionCount} dimensions
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IRISMilvusMonitor;


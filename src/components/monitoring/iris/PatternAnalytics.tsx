import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPatternVectors } from './milvusUtils';
import { PatternType } from './services/QuantumPatternService';

const patternSymbols: Record<PatternType, string> = {
  quantum: '⦿',
  dream: '⧉',
  consciousness: '⫰'
};

// Dimension reduction using PCA-like projection
const reduceDimensions = (vectors: number[][], targetDim: number = 2) => {
  const numVectors = vectors.length;
  if (numVectors === 0) return [];

  // Center the vectors
  const mean = vectors[0].map((_, colIndex) =>
    vectors.reduce((sum, row) => sum + row[colIndex], 0) / numVectors
  );

  const centered = vectors.map(vector =>
    vector.map((val, idx) => val - mean[idx])
  );

  // Simple projection onto first two principal components
  // This is a simplified version - in production you might want to use proper PCA
  const result = [];
  for (let vec of centered) {
    if (targetDim === 2) {
      result.push([
        vec.slice(0, vec.length/2).reduce((a, b) => a + b, 0),
        vec.slice(vec.length/2).reduce((a, b) => a + b, 0)
      ]);
    } else {
      result.push([
        vec.slice(0, vec.length/3).reduce((a, b) => a + b, 0),
        vec.slice(vec.length/3, 2*vec.length/3).reduce((a, b) => a + b, 0),
        vec.slice(2*vec.length/3).reduce((a, b) => a + b, 0)
      ]);
    }
  }
  return result;
};
const PatternAnalytics = () => {
  const [vectorData, setVectorData] = useState<PatternVector[]>([]);
  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetrics>({
    totalVectors: 0,
    patternDistribution: {},
    averageDistance: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetchAndAnalyzeData = async () => {
    setIsLoading(true);
    try {
          interface VectorResponse {
            success: boolean;
            vectors: PatternVector[];
          }

          const result = await getPatternVectors() as unknown as VectorResponse;

          if (result.success && result.vectors) {
            setVectorData(result.vectors);

        // Calculate basic metrics
              const patterns = result.vectors.map((v) => v.pattern_type);
                          const uniquePatterns = [...new Set(patterns)];
                          type PatternType = 'quantum' | 'dream' | 'consciousness';

                          const patternSymbols: Record<PatternType, string> = {
                            quantum: '⦿',
                            dream: '⧉',
                            consciousness: '⫰'
                          };

                          const plotData = uniquePatterns.map(pattern => ({
                            name: `${pattern} ${patternSymbols[pattern as PatternType]}`,
                            value: analysisMetrics.patternDistribution[pattern]
                          }));              const patternCounts = patterns.reduce((acc, pattern) => {
                acc[pattern] = (acc[pattern] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

        setAnalysisMetrics({
          totalVectors: result.vectors.length,
          patternDistribution: patternCounts,
          averageDistance: calculateAverageDistance(result.vectors)
        });
      }
    } catch (error) {
      console.error('Failed to fetch pattern vectors:', error);
      // Handle error state appropriately
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAndAnalyzeData();
    const interval = setInterval(fetchAndAnalyzeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const calculateAverageDistance = (vectors: any[]) => {
    if (vectors.length < 2) return 0;
    let totalDist = 0;
    let count = 0;

    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        totalDist += euclideanDistance(vectors[i].pattern_vector, vectors[j].pattern_vector);
        count++;
      }
    }
    return totalDist / count;
  };

  const euclideanDistance = (v1: number[], v2: number[]) => {
    return Math.sqrt(v1.reduce((sum, val, idx) => sum + Math.pow(val - v2[idx], 2), 0));
  };

  const renderDistributionPlot = () => {
    const { patternDistribution } = analysisMetrics;
    if (!patternDistribution) return null;

    const uniquePatterns = Object.keys(patternDistribution);
    const patternSymbols: Record<PatternType, string> = {
      quantum: '⦿',
      dream: '⧉',
      consciousness: '⫰'
    };

    const plotData = uniquePatterns.map(pattern => ({
      name: `${pattern} ${patternSymbols[pattern as PatternType]}`,
      value: patternDistribution[pattern]
    }));

    return (
      <Plot
        data={[{
          type: 'bar',
          x: plotData.map(d => d.name),
          y: plotData.map(d => d.value),
          marker: { color: ['#FF6B6B', '#4ECDC4', '#45B7D1'] }
        }]}
        layout={{
          title: 'Pattern Type Distribution',
          autosize: true,
          height: 300,
          margin: { l: 40, r: 20, t: 40, b: 30 }
        }}
        config={{ responsive: true }}
      />
    );
  };

  const renderDimensionalityPlot = () => {
    if (!vectorData.length) return null;

    // Use the service's vector processing methods
    const vectors = vectorData.map(v => v.pattern_vector);
    // TODO: Replace with actual vector normalization logic or import QuantumPatternService
    const processedVectors = vectors.map(vector => {
      const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
      return vector.map(val => val / magnitude);
    });
    const reduced = reduceDimensions(processedVectors, 3);
    return (
      <Plot
        data={[{
          type: 'scatter3d',
          mode: 'markers',
          x: reduced.map(v => v[0]),
          y: reduced.map(v => v[1]),
          z: reduced.map(v => v[2]),
          marker: {
            size: 5,
            color: vectorData.map(v =>
              v.pattern_type === 'quantum' ? 0 :
              v.pattern_type === 'dream' ? 1 : 2
            ),
            colorscale: 'Viridis'
          }
        }]}
        layout={{
          title: 'Pattern Space Distribution',
          autosize: true,
          height: 400,
          scene: {
            xaxis: { title: 'Component 1' },
            yaxis: { title: 'Component 2' },
            zaxis: { title: 'Component 3' }
          },
          margin: { l: 0, r: 0, b: 0, t: 30 }
        }}
        config={{ responsive: true }}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pattern Analysis Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div>Loading...</div> {/* Replaced LoadingSpinner with a simple loading text */}
          </div>
        ) : (
          <Tabs defaultValue="distribution">
            <TabsList>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="space">Pattern Space</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="h-[400px]">
              {renderDistributionPlot()}
            </TabsContent>

            <TabsContent value="space" className="h-[400px]">
              {renderDimensionalityPlot()}
            </TabsContent>

            <TabsContent value="metrics">
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-4 border rounded">
                  <h3 className="font-medium">Total Vectors</h3>
                  <p className="text-2xl">{analysisMetrics.totalVectors || 0}</p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="font-medium">Average Distance</h3>
                  <p className="text-2xl">
                    {analysisMetrics.averageDistance?.toFixed(4) || 0}
                  </p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="font-medium">Pattern Types</h3>
                  <p className="text-2xl">
                    {Object.keys(analysisMetrics.patternDistribution || {}).length}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
export default PatternAnalytics;

interface PatternVector {
  pattern_type: string;
  pattern_vector: number[];
}

interface AnalysisMetrics {
  totalVectors: number;
  patternDistribution: Record<string, number>;
  averageDistance: number;
}

interface VectorResponse {
  success: boolean;
  vectors: PatternVector[];
}


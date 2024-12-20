import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getPatternVectors } from './milvusUtils';

interface QualityMetrics {
  normalization: number;
  consistency: number;
  dimensionality: boolean;
  coverage: number;
  anomalies: number;
}

const VectorQualityMonitor = () => {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    normalization: 0,
    consistency: 0,
    dimensionality: true,
    coverage: 0,
    anomalies: 0
  });
  const [alerts, setAlerts] = useState<string[]>([]);

  const checkVectorQuality = async () => {
    const result = await getPatternVectors();
    if (!result?.success || !result?.vectors?.length) {
      setAlerts(['Failed to fetch vectors for quality check']);
      return;
    }

    const vectors = result.vectors.map(v => v.vector);
    const newAlerts: string[] = [];

    // Check vector normalization
    const normScores = vectors.map(vector => {
      const norm = Math.sqrt(vector.reduce((sum: number, val: number) => sum + val * val, 0));
      return Math.abs(1 - norm);
    });
    const avgNormScore = 100 * (1 - normScores.reduce((a: number, b: number) => a + b, 0) / vectors.length);

    // Check vector consistency
    const consistencyScore = checkConsistency(vectors);

    // Check dimensionality
    const dimCheck = vectors.every(v => v.length === 512);

    // Check coverage
    const coverageScore = calculateCoverage(vectors);

    // Check for anomalies
    const anomalyCount = detectAnomalies(vectors);

    setQualityMetrics({
      normalization: avgNormScore,
      consistency: consistencyScore,
      dimensionality: dimCheck,
      coverage: coverageScore,
      anomalies: anomalyCount
    });

    // Generate alerts
    if (avgNormScore < 95) {
      newAlerts.push('Vector normalization below threshold');
    }
    if (consistencyScore < 80) {
      newAlerts.push('Low pattern consistency detected');
    }
    if (!dimCheck) {
      newAlerts.push('Inconsistent vector dimensions found');
    }
    if (coverageScore < 70) {
      newAlerts.push('Low vector space coverage');
    }
    if (anomalyCount > vectors.length * 0.1) {
      newAlerts.push('High number of anomalous vectors detected');
    }

    setAlerts(newAlerts);
  };
  const checkConsistency = (vectors: number[][]) => {
    let totalSimilarity = 0;
    let count = 0;

    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        const similarity = cosineSimilarity(vectors[i], vectors[j]);
        totalSimilarity += similarity;
        count++;
      }
    }

    return count > 0 ? (totalSimilarity / count) * 100 : 0;
  };

  const calculateCoverage = (vectors: number[][]) => {
    const dimensions = vectors[0].length;
    let totalVariance = 0;

    for (let dim = 0; dim < dimensions; dim++) {
      const values = vectors.map(v => v[dim]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      totalVariance += variance;
    }

    return Math.min(100, (totalVariance / dimensions) * 100);
  };

  const detectAnomalies = (vectors: number[][]) => {
    const magnitudes = vectors.map(v =>
      Math.sqrt(v.reduce((sum, val) => sum + val * val, 0))
    );

    const sorted = [...magnitudes].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    return magnitudes.filter(mag => mag < lowerBound || mag > upperBound).length;
  };

  const cosineSimilarity = (v1: number[], v2: number[]) => {
    const dot = v1.reduce((sum, val, idx) => sum + val * v2[idx], 0);
    const norm1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
    return dot / (norm1 * norm2);
  };

  useEffect(() => {
    checkVectorQuality();
    const interval = setInterval(checkVectorQuality, 30000);
    return () => clearInterval(interval);
  }, []);

  const getQualityStatus = () => {
    const score = [
      qualityMetrics.normalization,
      qualityMetrics.consistency,
      qualityMetrics.dimensionality ? 100 : 0,
      qualityMetrics.coverage
    ].reduce((a, b) => a + b, 0) / 4;

    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 75) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 60) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const status = getQualityStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vector Quality Monitor</span>
          <Badge className={status.color}>{status.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Normalization</span>
                <span>{qualityMetrics.normalization.toFixed(1)}%</span>
              </div>
              <Progress value={qualityMetrics.normalization} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Pattern Consistency</span>
                <span>{qualityMetrics.consistency.toFixed(1)}%</span>
              </div>
              <Progress value={qualityMetrics.consistency} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Vector Space Coverage</span>
                <span>{qualityMetrics.coverage.toFixed(1)}%</span>
              </div>
              <Progress value={qualityMetrics.coverage} className="h-2" />
            </div>

            <div className="flex items-center space-x-2">
              <span>Dimensionality Check:</span>
              {qualityMetrics.dimensionality ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span>Anomalous Vectors:</span>
              <span className={qualityMetrics.anomalies > 0 ? 'text-yellow-500' : 'text-green-500'}>
                {qualityMetrics.anomalies}
              </span>
            </div>
          </div>

          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VectorQualityMonitor;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, FileJson, Loader2 } from 'lucide-react';
import { getPatternVectors, insertPatternVector } from './milvusUtils';

const VectorDataTransfer = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      setAlert(null);
      
      const result = await getPatternVectors();
      if (!result.success) throw new Error('Failed to fetch vectors');

      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        vectors: result.vectors.map(v => ({
          pattern_vector: v.pattern_vector,
          pattern_type: v.pattern_type,
          symbol: v.symbol,
          timestamp: v.timestamp
        }))
      };

      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iris_pattern_vectors_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setAlert({
        type: 'success',
        message: `Successfully exported ${exportData.vectors.length} vectors`
      });
    } catch (error) {
      console.error('Export error:', error);
      setAlert({
        type: 'error',
        message: 'Failed to export vectors: ' + (error as Error).message
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setImporting(true);
      setAlert(null);
      
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importData = JSON.parse(content);

          // Validate import data structure
          if (!importData.vectors || !Array.isArray(importData.vectors)) {
            throw new Error('Invalid import file structure');
          }

          // Import vectors sequentially
          let successful = 0;
          for (const vector of importData.vectors) {
            if (!vector.pattern_vector || !Array.isArray(vector.pattern_vector)) {
              console.warn('Skipping invalid vector entry:', vector);
              continue;
            }

            const result = await insertPatternVector(
              vector.pattern_vector,
              vector.pattern_type || 'unknown',
              vector.symbol || '⦿'
            );

            if (result.success) successful++;
          }

          setAlert({
            type: 'success',
            message: `Successfully imported ${successful} out of ${importData.vectors.length} vectors`
          });
        } catch (error) {
          console.error('Import processing error:', error);
          setAlert({
            type: 'error',
            message: 'Failed to process import file: ' + (error as Error).message
          });
        } finally {
          setImporting(false);
          // Reset file input
          event.target.value = '';
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      setAlert({
        type: 'error',
        message: 'Failed to import vectors: ' + (error as Error).message
      });
      setImporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vector Data Transfer</span>
          <FileJson className="w-5 h-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button 
                onClick={handleExport}
                disabled={exporting}
                className="flex-1"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Vectors
              </Button>

              <div className="relative flex-1">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button 
                  className="w-full"
                  disabled={importing}
                >
                  {importing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Import Vectors
                </Button>
              </div>
            </div>
          </div>

          {alert && (
            <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-gray-500">
            <p>Supported format: JSON</p>
            <p>Vector dimensions: 512</p>
            <p>Includes: pattern type, symbol, and timestamp metadata</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VectorDataTransfer;

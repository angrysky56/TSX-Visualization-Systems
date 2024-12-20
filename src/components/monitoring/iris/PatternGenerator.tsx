import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { insertPatternVector } from './milvusUtils';
import { Loader2 } from 'lucide-react';

const generatePatternVector = (patternType: string) => {
  // Generate base vector
  const base = new Array(512).fill(0).map(() => Math.random() * 2 - 1);
  
  // Apply pattern-specific emphasis
  if (patternType === "quantum") {
    for (let i = 0; i < 170; i++) {
      base[i] *= 2;
    }
    for (let i = 0; i < 512; i++) {
      base[i] += 0.5 * Math.sin(i / 51.2);
    }
  } else if (patternType === "dream") {
    for (let i = 171; i < 340; i++) {
      base[i] *= 2;
    }
    for (let i = 0; i < 512; i++) {
      base[i] += 0.3 * (Math.random() * 2 - 1);
    }
  } else {
    for (let i = 341; i < 512; i++) {
      base[i] *= 2;
    }
  }

  // Normalize
  const norm = Math.sqrt(base.reduce((acc, val) => acc + val * val, 0));
  return base.map(x => x / norm);
};

const PatternGenerator = () => {
  const [patternType, setPatternType] = useState("quantum");
  const [symbol, setSymbol] = useState("⦿");
  const [batchSize, setBatchSize] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateBatch = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const batchPromises = [];
      const batchChunkSize = 10; // Process 10 vectors at a time
      let completed = 0;

      for (let i = 0; i < batchSize; i += batchChunkSize) {
        const chunkSize = Math.min(batchChunkSize, batchSize - i);
        const chunkPromises = Array(chunkSize).fill(0).map(async () => {
          const vector = generatePatternVector(patternType);
          await insertPatternVector(vector, patternType, symbol);
          completed++;
          setProgress((completed / batchSize) * 100);
        });

        // Process chunk
        await Promise.all(chunkPromises);
      }

      console.log(`Generated and inserted ${batchSize} vectors successfully`);
    } catch (error) {
      console.error('Error generating batch:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pattern Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Select value={patternType} onValueChange={setPatternType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pattern Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quantum">Quantum</SelectItem>
                <SelectItem value="dream">Dream</SelectItem>
                <SelectItem value="consciousness">Consciousness</SelectItem>
              </SelectContent>
            </Select>

            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="⦿">⦿</SelectItem>
                <SelectItem value="⧈">⧈</SelectItem>
                <SelectItem value="⫰">⫰</SelectItem>
                <SelectItem value="◬">◬</SelectItem>
                <SelectItem value="⬡">⬡</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Batch Size: {batchSize}</span>
            </div>
            <Slider 
              value={[batchSize]}
              onValueChange={([value]) => setBatchSize(value)}
              min={10}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating vectors...</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={generateBatch} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Batch...
              </>
            ) : (
              `Generate ${batchSize} Vectors`
            )}
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <p>Vector dimensions: 512</p>
          <p>Pattern types have different characteristic distributions</p>
          <p>All vectors are normalized</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternGenerator;

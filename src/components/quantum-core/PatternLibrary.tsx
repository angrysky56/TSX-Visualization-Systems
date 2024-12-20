import React, { useState, useEffect } from 'react';
import { useMilvus } from '../core/MilvusConnector';
import { Pattern, QuantumPatternService } from '../../services/quantumPatternService';
import { DreamWeaver } from '../quantum/DreamWeaver';
import { ConsciousnessThreading } from '../quantum/ConsciousnessThreading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PatternLibrary: React.FC = () => {
    const { isConnected, error } = useMilvus();
    const [storedPatterns, setStoredPatterns] = useState<Pattern[]>([]);
    const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
    const [searchVector, setSearchVector] = useState<number[] | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'dream' | 'consciousness'>('grid');

    const savePattern = async (pattern: Pattern) => {
        try {
            // Save to Milvus
            const timestamp = Date.now();
            await window.api.milvus.insert('quantum_patterns', {
                pattern_vector: pattern.vector,
                pattern_type: pattern.type,
                symbol: pattern.symbol,
                timestamp
            });

            // Update local state
            setStoredPatterns(prev => [...prev, { ...pattern, timestamp }]);
        } catch (error) {
            console.error('Failed to save pattern:', error);
        }
    };

    const searchSimilarPatterns = async (vector: number[]) => {
        try {
            setSearchVector(vector);
            const results = await window.api.milvus.search('quantum_patterns', {
                vector,
                topk: 5
            });
            // Update visualization with similar patterns
            const patterns = results.map(result => ({
                vector: result.pattern_vector,
                type: result.pattern_type,
                symbol: result.symbol
            }));
            setStoredPatterns(patterns);
        } catch (error) {
            console.error('Failed to search patterns:', error);
        }
    };

    return (
        <div className="p-6">
            <Tabs defaultValue="library" className="w-full">
                <TabsList>
                    <TabsTrigger value="library">Pattern Library</TabsTrigger>
                    <TabsTrigger value="dream">Dream Weaver</TabsTrigger>
                    <TabsTrigger value="consciousness">Consciousness Threading</TabsTrigger>
                </TabsList>

                <TabsContent value="library">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quantum Pattern Library</CardTitle>
                            <CardDescription>
                                Store, retrieve, and analyze quantum patterns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                {storedPatterns.map((pattern, index) => (
                                    <Card 
                                        key={index}
                                        className="cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => setSelectedPattern(pattern)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="text-2xl text-center mb-2">
                                                {pattern.symbol}
                                            </div>
                                            <div className="text-sm text-center">
                                                {pattern.type}
                                            </div>
                                            <Button 
                                                className="w-full mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    searchSimilarPatterns(pattern.vector);
                                                }}
                                            >
                                                Find Similar
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dream">
                    {selectedPattern && (
                        <Card>
                            <CardContent className="p-0">
                                <DreamWeaver pattern={selectedPattern} />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="consciousness">
                    {storedPatterns.length > 0 && (
                        <Card>
                            <CardContent className="p-0">
                                <ConsciousnessThreading patterns={storedPatterns} />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error.message}
                </div>
            )}
        </div>
    );
};


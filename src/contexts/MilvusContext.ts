import { createContext } from 'react';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

export const MilvusContext = createContext<MilvusClient | null>(null);


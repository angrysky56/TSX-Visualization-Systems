import React from 'react';
import IRISMilvusMonitor from './IRISMilvusMonitor';
import PatternGenerator from './PatternGenerator';
import PatternAnalytics from './PatternAnalytics';
import VectorQualityMonitor from './VectorQualityMonitor';
import VectorDataTransfer from './VectorDataTransfer';

const IRISMilvusDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IRISMilvusMonitor />
        <VectorQualityMonitor />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <PatternAnalytics />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PatternGenerator />
        <VectorDataTransfer />
      </div>
    </div>
  );
};

export default IRISMilvusDashboard;

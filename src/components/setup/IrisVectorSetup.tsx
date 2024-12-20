import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const IrisVectorSetup = () => {
  const [status, setStatus] = useState({
    qpre: 'initializing',
    dss: 'initializing',
    tcw: 'initializing'
  });
  const [setupPhase, setSetupPhase] = useState('initializing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initializeVectorSpaces = async () => {
      try {
        // QPRE Phase
        setSetupPhase('qpre');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus(prev => ({...prev, qpre: 'ready'}));

        // DSS Phase
        setSetupPhase('dss');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus(prev => ({...prev, dss: 'ready'}));

        // TCW Phase
        setSetupPhase('tcw');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus(prev => ({...prev, tcw: 'ready'}));

        setSetupPhase('complete');
        setMessage('IRIS vector spaces initialized successfully');
      } catch (error) {
        console.error('Error initializing vector spaces:', error);
        setMessage('Error initializing vector spaces');
        setStatus({
          qpre: 'failed',
          dss: 'failed',
          tcw: 'failed'
        });
      }
    };

    initializeVectorSpaces();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getSetupPhaseDisplay = () => {
    switch(setupPhase) {
      case 'qpre':
        return 'Initializing Quantum Pattern Recognition Engine';
      case 'dss':
        return 'Setting up Dream State Synthesis';
      case 'tcw':
        return 'Configuring Temporal Consciousness Weaver';
      case 'complete':
        return 'Setup Complete';
      default:
        return 'Preparing Setup';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>IRIS Vector Space Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertTitle>{getSetupPhaseDisplay()}</AlertTitle>
          <AlertDescription>Configuring IRIS components in vector space</AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Quantum Pattern Recognition Engine</span>
              <p className="text-sm text-gray-500">512-dimensional HNSW_SQ8 index</p>
            </div>
            <span className={`${getStatusColor(status.qpre)} font-semibold`}>
              {status.qpre.toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Dream State Synthesis</span>
              <p className="text-sm text-gray-500">256-dimensional IVF_FLAT index</p>
            </div>
            <span className={`${getStatusColor(status.dss)} font-semibold`}>
              {status.dss.toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Temporal Consciousness Weaver</span>
              <p className="text-sm text-gray-500">128-dimensional IVF_SQ8 index</p>
            </div>
            <span className={`${getStatusColor(status.tcw)} font-semibold`}>
              {status.tcw.toUpperCase()}
            </span>
          </div>

          {message && (
            <Alert className={`mt-4 ${message.includes('successfully') ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <AlertTitle>{message}</AlertTitle>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IrisVectorSetup;

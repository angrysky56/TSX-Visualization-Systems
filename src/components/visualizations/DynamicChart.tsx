import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// @ts-ignore
import { usePuppeteerActions } from '../../services/PuppeteerService';
// If 'recharts' module is not found, make sure to install it:
// npm install recharts
// or
// yarn add rechartsimport { usePuppeteerActions } from '../../services/PuppeteerService';

const DynamicChart: React.FC = () => {
  const [data, setData] = useState([
    { name: 'A', value: 40 },
    { name: 'B', value: 30 },
    { name: 'C', value: 45 },
  ]);
  const { executeAction, isLoading } = usePuppeteerActions();

  // Example of live data update
  const updateData = async () => {
    await executeAction({
      type: 'evaluate',
      script: `
        window.updateChartData = (newData) => {
          window.reactSetData(newData);
        }
      `
    });
  };

  React.useEffect(() => {
    (window as any).reactSetData = setData;
  }, []);
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Dynamic Chart</h2>
      <div className="w-full overflow-x-auto">
        <LineChart width={600} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>
      <button 
        onClick={updateData}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Update Data
      </button>
    </div>
  );
};
export default DynamicChart;

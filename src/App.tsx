import { FC } from 'react';
import { PatternWorkspace } from './components/quantum-core/PatternWorkspace';
import { MilvusProvider } from "./components/core/MilvusConnector";
const App: FC = () => {
  return (
    <MilvusProvider address="localhost:19530">
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <header className="bg-black bg-opacity-40 p-4">
          <h1 className="text-2xl font-bold text-center">TSX Visualization Systems</h1>
        </header>
        <main className="container mx-auto p-4">
          <PatternWorkspace />
        </main>
      </div>
    </MilvusProvider>
  );
};export default App;


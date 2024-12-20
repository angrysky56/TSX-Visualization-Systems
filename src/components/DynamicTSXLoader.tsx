import React, { useState, useEffect } from 'react';
import { FileSearch, AlertCircle } from 'lucide-react';

interface DynamicTSXLoaderProps {
  folderPath: string;
}

const DynamicTSXLoader: React.FC<DynamicTSXLoaderProps> = ({ folderPath }) => {
  const [components, setComponents] = useState<Record<string, React.ComponentType>>({});
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        // This would be replaced with your actual loading logic
        const modules = import.meta.glob('/src/components/**/*.tsx');
        const loadedComponents: Record<string, React.ComponentType> = {};

        for (const path in modules) {
          const module = await modules[path]() as { default?: React.ComponentType };
          const componentName = path.split('/').pop()?.replace('.tsx', '') || '';
          if (module.default) {
            loadedComponents[componentName] = module.default;
          }
        }

        setComponents(loadedComponents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load components');
      }
    };
    loadComponents();
  }, [folderPath]);

  const ComponentToRender = selectedComponent ? components[selectedComponent] : null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <label htmlFor="component-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Component
        </label>
        <select
          id="component-select"
          className="block w-full rounded-md border border-gray-300 px-3 py-2"
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          aria-label="Select a component to render"
        >
          <option value="">Choose a component...</option>
          {Object.keys(components).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="border rounded-lg p-4">
        {error ? (
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        ) : !Object.keys(components).length ? (
          <div className="flex items-center justify-center h-40 text-gray-500">
            <FileSearch className="h-8 w-8 mr-2" />
            <span>Loading components...</span>
          </div>
        ) : ComponentToRender ? (
          <ComponentToRender />
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500">
            <span>Select a component to render</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default DynamicTSXLoader;

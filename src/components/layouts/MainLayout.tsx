import React from 'react';
import { Sidebar } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 text-gray-500 focus:outline-none"
                aria-label="Toggle sidebar"
                title="Toggle sidebar">
                <Sidebar className="h-6 w-6" />
              </button>
              <h1 className="flex items-center text-xl font-semibold">TSX Visualization System</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'w-64' : 'w-0'} 
          transition-all duration-300 ease-in-out 
          bg-white shadow-lg
        `}>
          <nav className="mt-5 px-2">
            {/* Navigation items will go here */}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
export default MainLayout;

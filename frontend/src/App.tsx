import { Header, ErrorBanner } from './components/common';
import { PromptInput } from './components/PromptInput';
import { SchemaVisualizer } from './components/SchemaVisualizer';
import { SQLEditor } from './components/SQLEditor';
import { ExportOptions } from './components/ExportOptions';
import { useSchema } from './store/schemaStore';

function App() {
  const schema = useSchema();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 pb-6 space-y-6">
        {/* Error Banner */}
        <ErrorBanner />

        {/* Prompt Input */}
        <PromptInput />

        {/* Export Options (shown when schema exists) */}
        {schema && <ExportOptions />}

        {/* Split View Workspace */}
        {schema && (
          <div className="split-view min-h-[600px] animate-fade-in">
            {/* Left Panel - Visualizer */}
            <SchemaVisualizer />

            {/* Right Panel - SQL Editor */}
            <SQLEditor />
          </div>
        )}

        {/* Empty State */}
        {!schema && (
          <div className="glass-card p-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-primary-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-surface-100">
                Ready to Design Your Database
              </h2>
              <p className="text-surface-400">
                Enter a description of your application above, and our AI will generate
                a complete database schema with tables, relationships, indexes, and stored procedures.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                <span className="badge-primary">Tables</span>
                <span className="badge-primary">Relationships</span>
                <span className="badge-primary">Indexes</span>
                <span className="badge-primary">Stored Procedures</span>
                <span className="badge-primary">ER Diagrams</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-surface-500">
        <p>
          Database Architect Agent • Powered by AI • 
          <span className="text-surface-400 ml-1">
            MySQL & PostgreSQL supported
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import { Code, Copy, Check } from 'lucide-react';
import { useCompiledSQL, useSchema } from '../../store/schemaStore';

export const SQLEditor = () => {
  const compiledSQL = useCompiledSQL();
  const schema = useSchema();
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current && compiledSQL) {
      Prism.highlightElement(codeRef.current);
    }
  }, [compiledSQL]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiledSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!schema) {
    return (
      <div className="glass-card h-full flex flex-col">
        <div className="panel-header px-6 pt-6 pb-4">
          <div className="panel-title">
            <Code className="w-5 h-5 text-accent-400" />
            <span>SQL Editor</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-surface-500">
          <div className="text-center space-y-3">
            <Code className="w-16 h-16 mx-auto opacity-50" />
            <p className="text-lg">No SQL Generated</p>
            <p className="text-sm">Generate a schema to see the SQL DDL</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="panel-header px-6 pt-6 pb-4 flex-shrink-0">
        <div className="panel-title">
          <Code className="w-5 h-5 text-accent-400" />
          <span>SQL Editor</span>
          <span className="badge-primary ml-2">
            {schema.dialect.toUpperCase()}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="btn-secondary text-sm"
          disabled={!compiledSQL}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy SQL</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="relative">
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-950 border-r border-surface-800 rounded-l-xl">
            <div className="p-4 font-mono text-sm text-surface-600 text-right select-none">
              {compiledSQL.split('\n').map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          {/* Code */}
          <pre className="code-block pl-16 min-h-[400px] !rounded-xl">
            <code ref={codeRef} className="language-sql">
              {compiledSQL}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;

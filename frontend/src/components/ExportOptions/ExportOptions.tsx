import { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  FileImage, 
  FileJson,
  ChevronDown 
} from 'lucide-react';
import { useCompiledSQL, useCompiledMermaid, useSchema } from '../../store/schemaStore';

export const ExportOptions = () => {
  const compiledSQL = useCompiledSQL();
  const compiledMermaid = useCompiledMermaid();
  const schema = useSchema();
  
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(compiledSQL);
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2000);
    } catch (err) {
      console.error('Failed to copy SQL:', err);
    }
  };

  const handleCopyMermaid = async () => {
    try {
      await navigator.clipboard.writeText(compiledMermaid);
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2000);
    } catch (err) {
      console.error('Failed to copy Mermaid:', err);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSQL = () => {
    if (!schema) return;
    const filename = `${schema.name.toLowerCase().replace(/\s+/g, '_')}_schema.sql`;
    downloadFile(compiledSQL, filename, 'text/sql');
  };

  const handleDownloadMermaid = () => {
    if (!schema) return;
    const filename = `${schema.name.toLowerCase().replace(/\s+/g, '_')}_diagram.mmd`;
    downloadFile(compiledMermaid, filename, 'text/plain');
  };

  const handleDownloadJSON = () => {
    if (!schema) return;
    const filename = `${schema.name.toLowerCase().replace(/\s+/g, '_')}_schema.json`;
    downloadFile(JSON.stringify(schema, null, 2), filename, 'application/json');
  };

  if (!schema) {
    return null;
  }

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        {/* Copy SQL */}
        <button
          onClick={handleCopySQL}
          className="btn-secondary"
          disabled={!compiledSQL}
        >
          {copiedSQL ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copiedSQL ? 'Copied!' : 'Copy SQL'}</span>
        </button>

        {/* Copy Mermaid */}
        <button
          onClick={handleCopyMermaid}
          className="btn-secondary"
          disabled={!compiledMermaid}
        >
          {copiedMermaid ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copiedMermaid ? 'Copied!' : 'Copy Mermaid'}</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-surface-700" />

        {/* Download Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="btn-primary"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)} 
              />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full mt-2 right-0 w-56 bg-surface-800 border border-surface-700 rounded-xl shadow-xl z-20 py-2 animate-slide-up">
                <button
                  onClick={() => { handleDownloadSQL(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-surface-200 hover:bg-surface-700 transition-colors"
                >
                  <FileCode className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="font-medium">Download SQL</div>
                    <div className="text-xs text-surface-500">.sql file</div>
                  </div>
                </button>
                
                <button
                  onClick={() => { handleDownloadMermaid(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-surface-200 hover:bg-surface-700 transition-colors"
                >
                  <FileImage className="w-5 h-5 text-accent-400" />
                  <div>
                    <div className="font-medium">Download Mermaid</div>
                    <div className="text-xs text-surface-500">.mmd diagram file</div>
                  </div>
                </button>
                
                <div className="h-px bg-surface-700 my-2" />
                
                <button
                  onClick={() => { handleDownloadJSON(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-surface-200 hover:bg-surface-700 transition-colors"
                >
                  <FileJson className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium">Download JSON Schema</div>
                    <div className="text-xs text-surface-500">Raw schema data</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Schema Info */}
        <div className="ml-auto text-sm text-surface-400">
          <span className="font-medium text-surface-200">{schema.tables.length}</span> tables
          <span className="mx-2">•</span>
          <span className="font-medium text-surface-200">{schema.relationships.length}</span> relationships
          <span className="mx-2">•</span>
          <span className="font-medium text-surface-200">{schema.storedProcedures.length}</span> procedures
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;

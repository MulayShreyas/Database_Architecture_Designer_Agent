import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  Network, 
  Table as TableIcon, 
  ChevronRight, 
  ChevronDown,
  Key,
  Link,
  Trash2
} from 'lucide-react';
import { 
  useSchemaStore, 
  useCompiledMermaid, 
  useTables, 
  useRelationships 
} from '../../store/schemaStore';
import type { TableDefinition, RelationshipDefinition, Cardinality } from '../../engine/types';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#0ea5e9',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#0ea5e9',
    lineColor: '#0ea5e9',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    background: '#0f172a',
    mainBkg: '#1e293b',
    nodeBorder: '#0ea5e9',
    clusterBkg: '#1e293b',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#0f172a',
  },
  er: {
    useMaxWidth: true,
  },
});

// Mermaid Diagram Component
const MermaidDiagram = ({ diagram }: { diagram: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      if (!diagram || !containerRef.current) return;

      try {
        setError(null);
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagram);
        setSvgContent(svg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [diagram]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 text-sm p-4">
        <p>Diagram rendering error: {error}</p>
      </div>
    );
  }

  if (!diagram) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-surface-500 gap-4">
        <Network className="w-16 h-16 opacity-50" />
        <p className="text-lg">No schema to visualize</p>
        <p className="text-sm">Generate a schema to see the ER diagram</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto p-4 flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

// Tree Node for Tables
interface TreeNodeProps {
  table: TableDefinition;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

const TableTreeNode = ({ 
  table, 
  isExpanded, 
  isSelected, 
  onToggle, 
  onSelect 
}: TreeNodeProps) => {
  return (
    <div className="animate-fade-in">
      <div 
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="p-0.5 hover:bg-surface-700 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-surface-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-surface-400" />
          )}
        </button>
        <TableIcon className="w-4 h-4 text-primary-400" />
        <span className="font-medium text-surface-200">{table.name}</span>
        <span className="text-xs text-surface-500 ml-auto">
          {table.columns.length} cols
        </span>
      </div>

      {isExpanded && (
        <div className="ml-6 pl-3 border-l border-surface-700 space-y-1 py-1">
          {table.columns.map((column) => (
            <div 
              key={column.id}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 rounded-lg transition-all"
            >
              {column.isPrimaryKey && (
                <Key className="w-3.5 h-3.5 text-yellow-500" />
              )}
              {!column.isPrimaryKey && (
                <div className="w-3.5 h-3.5 rounded border border-surface-600" />
              )}
              <span className="font-mono">{column.name}</span>
              <span className="text-xs text-surface-500 ml-auto">
                {column.type}
                {column.length && `(${column.length})`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Relationship Item
interface RelationshipItemProps {
  relationship: RelationshipDefinition;
  isSelected: boolean;
  onSelect: () => void;
  onChangeCardinality: (cardinality: Cardinality) => void;
  onDelete: () => void;
}

const RelationshipItem = ({
  relationship,
  isSelected,
  onSelect,
  onChangeCardinality,
  onDelete,
}: RelationshipItemProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const cardinalityLabels: Record<Cardinality, string> = {
    'one-to-one': '1:1',
    'one-to-many': '1:N',
    'many-to-many': 'N:M',
  };

  return (
    <div 
      className={`p-3 rounded-lg border transition-all ${
        isSelected 
          ? 'bg-primary-500/10 border-primary-500/30' 
          : 'bg-surface-800/50 border-surface-700/50 hover:border-surface-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-accent-400" />
          <span className="text-sm font-medium text-surface-200">
            {relationship.sourceTable}
          </span>
          <span className="text-surface-500">→</span>
          <span className="text-sm font-medium text-surface-200">
            {relationship.targetTable}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
            className="badge-primary cursor-pointer hover:bg-primary-500/30"
          >
            {cardinalityLabels[relationship.cardinality]}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
            title="Delete relationship"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showOptions && (
        <div className="mt-3 pt-3 border-t border-surface-700 animate-slide-up">
          <p className="text-xs text-surface-400 mb-2">Change Cardinality:</p>
          <div className="flex gap-2">
            {(['one-to-one', 'one-to-many', 'many-to-many'] as Cardinality[]).map((c) => (
              <button
                key={c}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeCardinality(c);
                  setShowOptions(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  relationship.cardinality === c
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-700 text-surface-300 hover:bg-surface-600'
                }`}
              >
                {cardinalityLabels[c]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Schema Visualizer Component
export const SchemaVisualizer = () => {
  const compiledMermaid = useCompiledMermaid();
  const tables = useTables();
  const relationships = useRelationships();
  const { 
    selectedTableId, 
    selectTable, 
    selectedRelationshipId, 
    selectRelationship,
    changeCardinality,
    deleteRelationship 
  } = useSchemaStore();

  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'diagram' | 'tree'>('diagram');

  const toggleExpanded = (tableId: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
  };

  // Auto-expand all tables when schema changes
  useEffect(() => {
    if (tables.length > 0) {
      setExpandedTables(new Set(tables.map((t) => t.id)));
    }
  }, [tables]);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="panel-header px-6 pt-6 pb-4 flex-shrink-0">
        <div className="panel-title">
          <Network className="w-5 h-5 text-primary-400" />
          <span>Schema Visualizer</span>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-surface-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'diagram'
                ? 'bg-primary-500 text-white'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            ER Diagram
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'tree'
                ? 'bg-primary-500 text-white'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Tree View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'diagram' ? (
          <div className="mermaid-container h-full">
            <MermaidDiagram diagram={compiledMermaid} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-6 pb-6">
            {/* Tables Tree */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wide mb-3">
                Tables ({tables.length})
              </h3>
              <div className="space-y-1">
                {tables.map((table) => (
                  <TableTreeNode
                    key={table.id}
                    table={table}
                    isExpanded={expandedTables.has(table.id)}
                    isSelected={selectedTableId === table.id}
                    onToggle={() => toggleExpanded(table.id)}
                    onSelect={() => selectTable(table.id)}
                  />
                ))}
                {tables.length === 0 && (
                  <p className="text-surface-500 text-sm py-4 text-center">
                    No tables in schema
                  </p>
                )}
              </div>
            </div>

            {/* Relationships */}
            <div>
              <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wide mb-3">
                Relationships ({relationships.length})
              </h3>
              <div className="space-y-2">
                {relationships.map((rel) => (
                  <RelationshipItem
                    key={rel.id}
                    relationship={rel}
                    isSelected={selectedRelationshipId === rel.id}
                    onSelect={() => selectRelationship(rel.id)}
                    onChangeCardinality={(c: Cardinality) => changeCardinality(rel.id, c)}
                    onDelete={() => deleteRelationship(rel.id)}
                  />
                ))}
                {relationships.length === 0 && (
                  <p className="text-surface-500 text-sm py-4 text-center">
                    No relationships defined
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaVisualizer;

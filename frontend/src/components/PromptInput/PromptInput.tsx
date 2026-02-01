import { useState } from 'react';
import { Sparkles, Database, Loader2, Lightbulb } from 'lucide-react';
import type { SQLDialect } from '../../engine/types';
import { useSchemaStore } from '../../store/schemaStore';
import { api } from '../../services/api';

const EXAMPLE_PROMPTS = [
  "A multi-vendor e-commerce platform with inventory management, user reviews, and order tracking",
  "A project management tool with teams, tasks, milestones, and time tracking",
  "A social media platform with posts, comments, likes, followers, and messaging",
  "A hospital management system with patients, doctors, appointments, and medical records",
  "A restaurant reservation system with tables, menus, orders, and customer loyalty programs",
];

export const PromptInput = () => {
  const { 
    userPrompt, 
    setUserPrompt, 
    setSchema, 
    isGenerating, 
    setGenerating, 
    setError,
    schema
  } = useSchemaStore();
  
  const [dialect, setDialect] = useState<SQLDialect>('postgresql');
  const [showExamples, setShowExamples] = useState(false);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a description of your application');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const generatedSchema = await api.generateSchema(userPrompt, dialect);
      setSchema(generatedSchema);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schema');
    } finally {
      setGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setUserPrompt(example);
    setShowExamples(false);
  };

  const handleDialectChange = (newDialect: SQLDialect) => {
    setDialect(newDialect);
    // If schema exists, update its dialect
    if (schema) {
      useSchemaStore.getState().setDialect(newDialect);
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30">
          <Sparkles className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-100">
            Describe Your Application
          </h2>
          <p className="text-sm text-surface-400">
            The AI will generate a complete database schema
          </p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Describe your application in natural language. For example: 'An online learning platform with courses, lessons, quizzes, and student progress tracking...'"
            className="textarea min-h-[160px] pr-12"
            disabled={isGenerating}
          />
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-surface-700/50 hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-all"
            title="Show examples"
          >
            <Lightbulb className="w-5 h-5" />
          </button>
        </div>

        {/* Examples Dropdown */}
        {showExamples && (
          <div className="bg-surface-800 rounded-xl border border-surface-700 p-3 space-y-2 animate-slide-up">
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wide px-2">
              Example Prompts
            </p>
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-surface-300 hover:bg-surface-700 hover:text-surface-100 transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        )}

        {/* Dialect Selector and Generate Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Dialect Selector */}
          <div className="relative flex-shrink-0">
            <label className="label">SQL Dialect</label>
            <div className="relative">
              <select
                value={dialect}
                onChange={(e) => handleDialectChange(e.target.value as SQLDialect)}
                className="select w-full sm:w-48"
                disabled={isGenerating}
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex-1 flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt.trim()}
              className="btn-primary w-full sm:w-auto px-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Schema...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Schema</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;

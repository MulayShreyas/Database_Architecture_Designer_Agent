import { Database, Github } from 'lucide-react';

export const Header = () => {
  return (
    <header className="glass-card px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              Database Architect Agent
            </h1>
            <p className="text-xs text-surface-500">
              AI-Powered Schema Generation
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <span className="badge-success">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            AI Ready
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

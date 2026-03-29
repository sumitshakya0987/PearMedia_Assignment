import React from 'react';
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
            Pear Media Lab
          </h1>
          <p className="text-xs text-slate-500 font-medium">AI Prototyping Sandbox</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
        <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">GitHub</a>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Download, RefreshCw, Sparkles } from 'lucide-react';

const ImageCard = ({ imageUrl, isLoading, title = "Generated Image", onRegenerate }) => {
  if (isLoading) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-indigo-400" />
        <p className="font-medium animate-pulse">Generating Masterpiece...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 shadow-inner">
        <Sparkles className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm font-medium">No image generated yet.</p>
      </div>
    );
  }

  return (
    <div className="group relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-end">
        <p className="text-white font-medium truncate pr-4">{title}</p>
        <div className="flex gap-2">
          {onRegenerate && (
            <button 
              onClick={onRegenerate}
              className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur rounded-lg text-white transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <a filter="drop-shadow" href={imageUrl} download="pearmedia-generation.png" className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 shadow-md transition-colors" title="Download">
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

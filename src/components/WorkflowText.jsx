import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import ImageCard from './ImageCard';
import { enhancePrompt, generateImageFn } from '../utils/apiHelpers';
import { DEFAULT_TEXT_PROMPT } from '../utils/constants';

const WorkflowText = () => {
  const [userPrompt, setUserPrompt] = useState(DEFAULT_TEXT_PROMPT);
  const [enhancedText, setEnhancedText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEnhance = async () => {
    if (!userPrompt.trim()) return toast.warning("Please enter an idea first");
    try {
      setIsEnhancing(true);
      const enhanced = await enhancePrompt(userPrompt);
      setEnhancedText(enhanced);
      toast.success("Prompt magically enhanced!");
    } catch (err) {
      toast.error(err.message || "Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedText.trim()) return toast.warning("Please approve the text first");
    try {
      setIsGenerating(true);
      const url = await generateImageFn(enhancedText);
      setImageUrl(url);
      toast.success("Masterpiece created!");
    } catch (err) {
      toast.error(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        {/* Step 1: Input */}
        <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-32 h-32" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">1. Describe your vision</h2>
          <p className="text-slate-500 mb-4 text-sm">Keep it simple, AI will handle the magic details.</p>
          
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="E.g. A flying cat over New York..."
            className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4 shadow-inner text-slate-700"
          />
          
          <button 
            onClick={handleEnhance} 
            disabled={isEnhancing}
            className="primary-btn w-full"
          >
            {isEnhancing ? "Brewing magic..." : "Enhance Prompt"}
            {!isEnhancing && <Sparkles className="w-4 h-4" />}
          </button>
        </section>

        {/* Step 2: Approve & Tweak */}
        <section className={`glass-panel p-6 rounded-2xl transition-all duration-500 ${!enhancedText ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
          <h2 className="text-xl font-bold mb-2 text-slate-800">2. Review & Approve</h2>
          <p className="text-slate-500 mb-4 text-sm">The AI elaborated on your idea. Tweak it if needed.</p>
          
          <textarea
            value={enhancedText}
            onChange={(e) => setEnhancedText(e.target.value)}
            disabled={!enhancedText}
            className={`w-full h-32 p-4 rounded-xl border bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4 shadow-inner text-slate-700 ${!enhancedText ? 'border-dashed border-slate-300' : 'border-slate-200'}`}
          />
          
          <button 
            onClick={handleGenerate} 
            disabled={!enhancedText || isGenerating}
            className="primary-btn w-full bg-slate-900 border-none hover:bg-black shadow-slate-300"
          >
            {isGenerating ? "Generating Pixel by Pixel..." : "Generate Image"}
            {!isGenerating && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </section>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center">
         <ImageCard 
            isLoading={isGenerating} 
            imageUrl={imageUrl} 
            onRegenerate={imageUrl && enhancedText ? handleGenerate : null}
         />
         
         {imageUrl && (
           <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 font-medium w-full justify-center shadow-sm">
             <CheckCircle2 className="w-5 h-5" />
             Workflow Complete
           </div>
         )}
      </div>
    </div>
  );
};

export default WorkflowText;

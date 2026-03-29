import React, { useState, useRef } from 'react';
import { Sparkles, UploadCloud, FileSearch, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import ImageCard from './ImageCard';
import { analyzeImage, generateImageFn } from '../utils/apiHelpers';

const WorkflowImage = () => {
  const [sourceImageBase64, setSourceImageBase64] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [variationPrompt, setVariationPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning("Image too large. Please upload < 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceImageBase64(event.target.result);
      setAnalysisResult("");
      setVariationPrompt("");
      setGeneratedImageUrl(""); 
    };
    reader.onerror = () => toast.error("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!sourceImageBase64) return toast.warning("Upload an image first.");
    try {
      setIsAnalyzing(true);
      const findings = await analyzeImage(sourceImageBase64);
      setAnalysisResult(findings);
      setVariationPrompt(`A stylistic variation of: ${findings}`);
      toast.success("Image Reverse Engineered!");
    } catch (err) {
      toast.error(err.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!variationPrompt.trim()) return toast.warning("Prompt cannot be empty");
    try {
      setIsGenerating(true);
      const url = await generateImageFn(variationPrompt);
      setGeneratedImageUrl(url);
      toast.success("Variation generated!");
    } catch (err) {
      toast.error(err.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        {/* Step 1: Upload */}
        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-2 text-slate-800">1. Upload Inspiration</h2>
          <p className="text-slate-500 mb-4 text-sm">We will extract the style and objects from this image.</p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer flex flex-col items-center justify-center transition-colors mb-4 group overflow-hidden relative"
          >
            {sourceImageBase64 ? (
              <img src={sourceImageBase64} alt="Source" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            ) : (
              <div className="flex flex-col items-center text-indigo-500">
                <UploadCloud className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
                <span className="font-medium">Click to Upload (Max 2MB)</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={!sourceImageBase64 || isAnalyzing}
            className="primary-btn w-full"
          >
            {isAnalyzing ? "Analyzing Pixels..." : "Analyze Image"}
            {!isAnalyzing && <FileSearch className="w-4 h-4" />}
          </button>
        </section>

        {/* Step 2: Prompt Tweaking */}
        <section className={`glass-panel p-6 rounded-2xl transition-all duration-500 ${!analysisResult ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
           <h2 className="text-xl font-bold mb-2 text-slate-800">2. Variation Prompt</h2>
           <p className="text-slate-500 mb-4 text-sm">Extracted tags: <span className="text-indigo-600 font-mono text-xs p-1 bg-indigo-50 rounded ml-1">{analysisResult ? 'Success' : 'Pending'}</span></p>

           <textarea
            value={variationPrompt}
            onChange={(e) => setVariationPrompt(e.target.value)}
            disabled={!analysisResult}
            rows={4}
            className="w-full p-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4 shadow-inner text-slate-700"
          />

          <button 
            onClick={handleGenerate} 
            disabled={!variationPrompt || isGenerating}
            className="primary-btn w-full bg-slate-900 border-none hover:bg-black"
          >
            {isGenerating ? "Rendering Style..." : "Generate Variation"}
            {!isGenerating && <Sparkles className="w-4 h-4" />}
          </button>
        </section>
      </div>

      {/* Result Card */}
      <div className="lg:col-span-5 flex flex-col items-center">
         <ImageCard 
            isLoading={isGenerating} 
            imageUrl={generatedImageUrl} 
            title="Stylistic Variation"
            onRegenerate={generatedImageUrl && variationPrompt ? handleGenerate : null}
         />
      </div>
    </div>
  );
};

export default WorkflowImage;

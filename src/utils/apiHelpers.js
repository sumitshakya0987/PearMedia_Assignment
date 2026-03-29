import { API_MODELS } from './constants';

const getGeminiKey = () => import.meta.env.VITE_GEMINI_KEY;
const getHfKey = () => import.meta.env.VITE_HF_KEY;

/**
 * Text Workflow: Enhance a prompt using Gemini
 */
export const enhancePrompt = async (input) => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("Missing Gemini API Key in .env");

  const systemInstructions = "You are an expert prompt engineer. Transform the following simple request into a 50-word descriptive masterpiece including lighting, camera angle, and artistic style. DO NO USE MARKDOWN OR PREFIXES. OUTPUT ONLY THE FINAL PROMPT.";
  const fullPrompt = `${systemInstructions}\n\nUser request: ${input}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${API_MODELS.GEMINI_TEXT}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to enhance prompt");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

/**
 * Image Workflow: Analyze an image using Gemini Vision
 */
export const analyzeImage = async (base64String) => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("Missing Gemini API Key in .env");

  // Extract mimetype and un-prefixed base64
  let mimeType = 'image/jpeg';
  let base64Data = base64String;

  if (base64String.startsWith('data:')) {
    mimeType = base64String.substring(5, base64String.indexOf(';'));
    base64Data = base64String.split(',')[1];
  }

  const prompt = "Analyze this image and list: 1. Main Subject 2. Lighting 3. Artistic Style. Transform these details into a unified paragraph that can be used directly as a text-to-image prompt. Do not use numbering or markdown. Return only the prompt string.";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${API_MODELS.GEMINI_VISION}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to analyze image");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};


/**
 * Generate Image via Hugging Face REST endpoints using standard fetch
 */
export const generateImageFn = async (prompt) => {
  const apiKey = getHfKey();
  if (!apiKey) throw new Error("Missing Hugging Face API Key in .env");

  const response = await fetch(`/hf-api/models/${API_MODELS.HF_IMAGE}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "x-wait-for-model": "true",
      "x-use-cache": "false"
    },
    body: JSON.stringify({ 
      inputs: prompt,
      parameters: { negative_prompt: "blurry, bad anatomy, distorted, text, watermark" } 
    }),
  });

  if (!response.ok) {
    let msg = "Failed to generate image";
    try {
      const errorData = await response.json();
      msg = errorData.error || msg;
    } catch(e) {}
    throw new Error(msg);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

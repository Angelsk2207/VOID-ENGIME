
import React, { useState, useRef } from 'react';
// Fix: removed incorrect imports from audioUtils and rely on geminiService
import { editImageWithPrompt as editApi, animateImageWithVeo as animateApi } from '../services/geminiService';
import { VideoLoading } from './VideoLoading';
import { VideoPlayer } from './VideoPlayer';

export const ImageRitual: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [editPrompt, setEditPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const base64 = readerEvent.target?.result as string;
        setSourceImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !editPrompt) return;
    setIsProcessing(true);
    try {
      const base64Data = sourceImage.split(',')[1];
      const result = await editApi(base64Data, mimeType, editPrompt);
      setSourceImage(result);
      setEditPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnimate = async () => {
    if (!sourceImage) return;
    setIsVideoLoading(true);
    setVideoUrl(null);
    try {
      const base64Data = sourceImage.split(',')[1];
      const url = await animateApi(base64Data, mimeType);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVideoLoading(false);
    }
  };

  return (
    <section className="mt-20 pt-20 border-t border-gray-900">
      <h3 className="text-[10px] uppercase tracking-[0.5em] text-center text-gray-600 mb-12">Ritual de Imagem</h3>
      
      <div className="max-w-2xl mx-auto bg-[#0d0d0f] border border-[#1d1d20] p-8 rounded-lg shadow-2xl">
        {!sourceImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video border-2 border-dashed border-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-900/50 transition-colors group"
          >
            <svg className="w-12 h-12 text-gray-800 group-hover:text-red-900/50 mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-gray-400">Ofertar uma Visão (Upload)</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative group">
              <img src={sourceImage} alt="Visão" className="w-full rounded-lg border border-gray-800 shadow-inner" />
              <button 
                onClick={() => setSourceImage(null)}
                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-gray-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <input 
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Como deseja distorcer esta realidade? (Ex: Adicionar filtro retrô)"
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900 transition-colors text-sm text-gray-300 placeholder-gray-800 py-2"
                disabled={isProcessing}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={handleEdit}
                  disabled={isProcessing || !editPrompt}
                  className="flex-1 py-3 border border-gray-800 hover:border-gray-500 text-[9px] uppercase tracking-widest text-gray-500 hover:text-gray-100 transition-all disabled:opacity-30"
                >
                  {isProcessing ? 'Distorcendo...' : 'Editar Visão (Gemini 2.5)'}
                </button>
                <button
                  onClick={handleAnimate}
                  disabled={isVideoLoading}
                  className="flex-1 py-3 bg-red-950/20 border border-red-900/30 hover:border-red-900 text-[9px] uppercase tracking-widest text-red-900 hover:text-red-600 transition-all disabled:opacity-30"
                >
                  {isVideoLoading ? 'Animando...' : 'Animar Visão (Veo)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isVideoLoading && <div className="mt-8"><VideoLoading /></div>}
        {videoUrl && (
          <div className="mt-8">
            <h4 className="text-[9px] uppercase tracking-[0.3em] text-gray-700 mb-4 text-center">Visão Animada Manifestada</h4>
            <VideoPlayer videoUrl={videoUrl} title="Visao_Manifestada" />
          </div>
        )}
      </div>
    </section>
  );
};

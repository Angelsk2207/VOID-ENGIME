
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { StoryOutput } from './components/StoryOutput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ComicStrip } from './components/ComicStrip';
import { VoiceInterface } from './components/VoiceInterface';
import { ImageRitual } from './components/ImageRitual';
import { generateHorrorStory, generateHorrorVideo } from './services/geminiService';
import type { GeneratedStory } from './types';
import { VideoLoading } from './components/VideoLoading';
import { VideoPlayer } from './components/VideoPlayer';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedStory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(false);

  const aistudio = (window as any).aistudio;

  useEffect(() => {
    const checkApiKey = async () => {
      if (aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, [aistudio]);

  const handleSubmit = useCallback(async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setVideoUrl(null);

    try {
      const result = await generateHorrorStory(finalPrompt);
      setGeneratedContent(result);
    } catch (err: any) {
      setError('A escuridão recusou o comando. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes("leia") && generatedContent) {
      const ttsButton = document.querySelector('[aria-label="Ouvir narração da história"]') as HTMLButtonElement;
      if (ttsButton) ttsButton.click();
    } else if (command.length > 10) {
      setPrompt(command);
      handleSubmit(command);
    }
  };

  return (
    <div className="min-h-screen text-gray-400 font-sans selection:bg-[#451a1a]/50 selection:text-white pb-20 overflow-x-hidden relative">
      <Header />
      
      <VoiceInterface onCommand={handleVoiceCommand} isProcessing={isLoading} />

      <main className="container mx-auto px-6 max-w-5xl relative z-10">
        {!generatedContent && (
          <div className="mt-20 max-w-xl mx-auto space-y-12">
            <PromptForm
              prompt={prompt}
              setPrompt={setPrompt}
              handleSubmit={() => handleSubmit()}
              isLoading={isLoading}
            />
            
            <ImageRitual />

            <p className="text-[9px] text-gray-700 uppercase tracking-widest text-center mt-6">
              O vazio observa. Use o comando de voz para interagir.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        )}
        
        {error && <p className="text-center text-xs text-red-900 mt-10 italic font-mono uppercase tracking-tighter">{error}</p>}

        {generatedContent && !isLoading && (
          <div className="space-y-24">
            <StoryOutput content={generatedContent} />
            
            <ComicStrip 
              panels={generatedContent.comicPanels} 
              style={generatedContent.visualStyle} 
              onGenerateAttempt={async () => {
                if (!isApiKeySelected && aistudio) {
                   await aistudio.openSelectKey();
                   setIsApiKeySelected(true);
                }
              }}
            />

            <section className="pt-20 border-t border-gray-900 text-center">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-gray-600 mb-12">Manifestação Visual</h3>
              {videoUrl ? (
                <VideoPlayer videoUrl={videoUrl} title={generatedContent.title} />
              ) : isVideoLoading ? (
                <VideoLoading />
              ) : (
                <button
                  onClick={async () => {
                    if (!isApiKeySelected && aistudio) {
                      await aistudio.openSelectKey();
                      setIsApiKeySelected(true); 
                    }
                    setIsVideoLoading(true);
                    try {
                      const url = await generateHorrorVideo(generatedContent.title, generatedContent.visualStyle);
                      setVideoUrl(url);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsVideoLoading(false);
                    }
                  }}
                  className="px-12 py-4 border border-gray-800 hover:border-red-900 text-[10px] uppercase tracking-[0.4em] transition-all text-gray-600 hover:text-red-700 group relative"
                >
                  <span className="relative z-10">Materializar Visão Veo 3.1</span>
                  <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}
            </section>

            <ImageRitual />

            <div className="flex justify-center mt-20">
              <button 
                onClick={() => setGeneratedContent(null)}
                className="text-[9px] uppercase tracking-[0.3em] text-gray-800 hover:text-gray-500 transition-colors border-b border-transparent hover:border-gray-500 pb-1"
              >
                Voltar para a Escuridão
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-32 py-10 border-t border-gray-900/20 text-center relative z-10">
        <p className="text-[8px] uppercase tracking-[0.5em] text-gray-800">
          VOID ENGINE &bull; Você nunca está realmente sozinho.
        </p>
      </footer>
    </div>
  );
};

export default App;

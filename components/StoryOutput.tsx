
import React, { useState, useRef } from 'react';
import type { GeneratedStory } from '../types';
import { generateStoryAudio } from '../services/geminiService';
import { decodeAudioData } from '../services/audioUtils';

interface StoryOutputProps {
  content: GeneratedStory;
}

export const StoryOutput: React.FC<StoryOutputProps> = ({ content }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handlePlayAudio = async () => {
    setIsAudioLoading(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const bufferArray = await generateStoryAudio(content.story, content.narratorCues || "whispering and calm");
      const decodedBuffer = await decodeAudioData(new Uint8Array(bufferArray), audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error("Falha na narração:", e);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="mt-12 animate-fade-in max-w-3xl mx-auto" role="article">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-horror { font-family: 'Playfair Display', serif; }
      `}</style>
      
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-horror font-bold text-gray-100 mb-4 tracking-tighter leading-tight" aria-label={`Título da história: ${content.title}`}>
          {content.title}
        </h2>
        <div className="flex justify-center gap-4">
           <span className="text-[10px] uppercase tracking-[0.4em] text-gray-600 border-y border-gray-800 py-1">
             Relato Documentado
           </span>
        </div>
      </div>

      <article className="bg-[#121214] border border-[#1d1d20] rounded-sm p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#451a1a] to-transparent opacity-50"></div>
        
        <div className="prose prose-invert prose-lg max-w-none">
          {content.story.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-400 font-horror italic leading-relaxed mb-6 first-letter:text-3xl first-letter:text-gray-100 selection:bg-red-900/30">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800/50 flex justify-between items-center">
          <button 
            onClick={handlePlayAudio}
            disabled={isAudioLoading}
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-900 transition-all flex items-center gap-2 group"
            aria-label="Ouvir narração da história"
          >
            <span className={`w-2 h-2 rounded-full ${isAudioLoading ? 'bg-red-600 animate-ping' : 'bg-gray-800 group-hover:bg-red-900'}`}></span>
            {isAudioLoading ? 'Sintonizando frequências...' : 'Ativar Narração (TTS)'}
          </button>
          <div className="h-px flex-1 mx-8 bg-gray-900"></div>
          <span className="text-[10px] text-gray-700 italic">ID do Registro: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
      </article>

      <section className="mt-20" aria-label="Roteiro visual detalhado">
        <h3 className="text-sm uppercase tracking-[0.5em] text-center text-gray-600 mb-10">Análise de Cena</h3>
        <div className="space-y-6">
          {content.script.map((scene, index) => (
            <div key={index} className="group flex gap-6 items-start opacity-70 hover:opacity-100 transition-opacity p-4 border-l border-transparent hover:border-gray-800">
              <span className="text-xs font-mono text-gray-700 mt-1">[{index + 1}]</span>
              <div className="flex-1">
                <h4 className="text-gray-400 text-sm font-bold uppercase tracking-widest">{scene.scene}</h4>
                <p className="text-gray-500 text-xs italic mt-1 leading-relaxed">{scene.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


import React from 'react';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, handleSubmit, isLoading }) => {
  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-b from-gray-800 to-transparent rounded-lg blur opacity-20"></div>
      <div className="relative bg-[#0d0d0f] border border-[#1d1d20] p-6 rounded-lg shadow-2xl">
        <label className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-4">
          O que assombra seus pensamentos?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-gray-300 placeholder-gray-800 text-xl font-horror italic resize-none h-24 mb-4"
          placeholder="Descreva o vazio..."
          disabled={isLoading}
        />
        <div className="flex justify-between items-center pt-4 border-t border-gray-900">
          <span className="text-[10px] text-gray-700 font-mono">ESTADO: {isLoading ? 'PROCESSANDO' : 'PRONTO'}</span>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="group relative px-8 py-2 bg-transparent overflow-hidden transition-all"
          >
            <div className="absolute inset-0 bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative text-[10px] uppercase tracking-[0.4em] text-gray-500 group-hover:text-gray-100 transition-colors">
              {isLoading ? 'Conjurando...' : 'Iniciar Ritual'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

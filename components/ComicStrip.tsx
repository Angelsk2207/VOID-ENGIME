
import React, { useState } from 'react';
import { generateImagePanel } from '../services/geminiService';
import type { ComicPanel } from '../types';

interface ComicStripProps {
  panels: ComicPanel[];
  style: string;
  onGenerateAttempt?: () => Promise<void>;
}

export const ComicStrip: React.FC<ComicStripProps> = ({ panels, style, onGenerateAttempt }) => {
  const [panelImages, setPanelImages] = useState<Record<number, string>>({});
  const [loadingPanels, setLoadingPanels] = useState<Record<number, boolean>>({});

  const handleGeneratePanel = async (panel: ComicPanel) => {
    // Call the parent's check to ensure API key is selected if needed (for gemini-3-pro-image-preview)
    if (onGenerateAttempt) {
      await onGenerateAttempt();
    }

    setLoadingPanels(prev => ({ ...prev, [panel.panelNumber]: true }));
    try {
      const imageUrl = await generateImagePanel(panel.visualPrompt, style);
      setPanelImages(prev => ({ ...prev, [panel.panelNumber]: imageUrl }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPanels(prev => ({ ...prev, [panel.panelNumber]: false }));
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-center text-red-500 mb-8 font-serif uppercase tracking-widest">
        Fragmentos do Abismo (Quadrinhos)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panels.map((panel) => (
          <div key={panel.panelNumber} className="relative group bg-black border-4 border-gray-900 overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="aspect-[4/3] bg-gray-950 flex items-center justify-center">
              {panelImages[panel.panelNumber] ? (
                <img src={panelImages[panel.panelNumber]} alt={`Panel ${panel.panelNumber}`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                   <p className="text-gray-600 text-sm mb-4">{panel.visualPrompt.substring(0, 60)}...</p>
                   <button 
                    onClick={() => handleGeneratePanel(panel)}
                    disabled={loadingPanels[panel.panelNumber]}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-700 text-red-200 text-xs font-bold uppercase tracking-tighter rounded border border-red-900 transition-colors"
                   >
                     {loadingPanels[panel.panelNumber] ? 'Materializando...' : 'Gerar Painel'}
                   </button>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3 border-t-2 border-red-900/30">
              <p className="text-xs italic text-gray-300 font-serif leading-tight">
                "{panel.caption}"
              </p>
            </div>
            <div className="absolute top-2 left-2 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-50">
              #{panel.panelNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

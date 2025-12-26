
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decodeAudioData, decodeBase64 } from '../services/audioUtils';

interface VoiceInterfaceProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand, isProcessing }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const toggleVoice = async () => {
    if (isActive) {
      setIsActive(false);
      if (sessionRef.current) sessionRef.current.close();
      return;
    }

    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
          systemInstruction: 'Você é o guia do VOID ENGINE. Ajude o usuário a navegar pelo app de terror. Se ele pedir para criar uma história, confirme e diga que está processando. Seja sombrio e prestativo.',
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message) => {
            // Se houver áudio de resposta do modelo
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const buffer = await decodeAudioData(decodeBase64(audioData), audioContextRef.current);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              source.start();
            }

            // Se houver transcrição do que o usuário disse
            if (message.serverContent?.turnComplete && message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text && text.length > 5) {
                onCommand(text);
              }
            }
          },
          onclose: () => setIsActive(false),
          onerror: () => setIsActive(false),
        }
      });

      // Stream microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const l = inputData.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
        
        const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
        sessionPromise.then(session => {
          session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleVoice}
        disabled={isConnecting || isProcessing}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-2 ${
          isActive 
            ? 'bg-red-950 border-red-800 animate-pulse' 
            : 'bg-[#161618] border-gray-800 hover:border-gray-600'
        }`}
        aria-label={isActive ? "Desativar assistente de voz" : "Ativar assistente de voz"}
      >
        {isConnecting ? (
          <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
        ) : (
          <svg className={`w-6 h-6 ${isActive ? 'text-red-500' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        )}
      </button>
      {isActive && (
        <div className="absolute bottom-20 right-0 bg-black/80 backdrop-blur-md border border-gray-800 p-4 rounded-lg w-48 text-center animate-fade-in">
          <p className="text-[9px] uppercase tracking-widest text-red-900 font-bold mb-1">Escuta Ativa</p>
          <p className="text-[10px] text-gray-500 italic">"Peça para criar ou ler..."</p>
        </div>
      )}
    </div>
  );
};

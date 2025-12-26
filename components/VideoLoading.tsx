import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Consultando os espíritos do cinema...",
  "Ajustando o foco para o seu pesadelo...",
  "Renderizando cada grito em alta definição...",
  "Aguarde, a escuridão está tomando forma...",
  "Polindo os artefatos de uma dimensão sombria...",
  "Sincronizando o áudio com os batimentos cardíacos do medo...",
];

export const VideoLoading: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-purple-400">
      <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg font-semibold tracking-wider">
        Gerando seu curta-metragem...
      </p>
      <p className="mt-2 text-sm text-gray-400 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
      <p className="text-xs text-gray-500 mt-3">Isso pode levar alguns minutos.</p>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './IconComponents';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // The download link requires the API key to be appended.
        const response = await fetch(`${videoUrl}&key=${process.env.API_KEY}`);
        if (!response.ok) {
          throw new Error(`Falha ao buscar o vídeo: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const objectUrl = URL.createObjectURL(videoBlob);
        setVideoSrc(objectUrl);
      } catch (err: any) {
        setError(err.message || 'Não foi possível carregar o vídeo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();

    // Cleanup object URL on component unmount
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoUrl]);

  const handleDownload = async () => {
    if (!videoSrc) return;
    setIsDownloading(true);
    try {
        const response = await fetch(videoSrc);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Sanitize title to create a valid filename
        const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch(err) {
        console.error("Erro no download:", err);
    } finally {
        setIsDownloading(false);
    }
  };


  if (isLoading) {
    return <div className="text-center text-gray-400 py-4">Carregando player de vídeo...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-4 bg-red-900/30 rounded-md">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl shadow-purple-900/40">
        {videoSrc && (
          <video src={videoSrc} controls autoPlay muted loop className="w-full h-full">
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}
      </div>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center py-2 px-6 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-wait text-white font-bold rounded-lg shadow-md transition-colors"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        {isDownloading ? 'Baixando...' : 'Baixar Vídeo (MP4)'}
      </button>
    </div>
  );
};

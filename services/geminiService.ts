
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GeneratedStory } from '../types';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    story: { type: Type.STRING },
    visualStyle: { 
      type: Type.STRING, 
      description: "Estilo visual sóbrio (ex: Noir, desbotado, sombras densas, estética de filme antigo)." 
    },
    narratorCues: { type: Type.STRING, description: "Instruções de entonação para a voz (ex: sussurrante, apavorada, monótona)." },
    script: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scene: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["scene", "description"]
      }
    },
    comicPanels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          panelNumber: { type: Type.INTEGER },
          caption: { type: Type.STRING },
          visualPrompt: { type: Type.STRING }
        },
        required: ["panelNumber", "caption", "visualPrompt"]
      }
    }
  },
  required: ["title", "story", "visualStyle", "script", "comicPanels", "narratorCues"]
};

export const generateHorrorStory = async (prompt: string): Promise<GeneratedStory> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Você é um mestre do terror psicológico focado em realismo e pavor existencial. 
    Crie uma história para: "${prompt}". 
    O clima deve ser sóbrio, melancólico e perturbador. Evite clichês de monstros coloridos. 
    Foque no que NÃO é visto. Use o esquema JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      thinkingConfig: { thinkingBudget: 20000 },
      tools: [{ googleSearch: {} }]
    },
  });

  if (!response.text) throw new Error("A escuridão permaneceu em silêncio.");
  return JSON.parse(response.text.trim()) as GeneratedStory;
};

export const generateStoryAudio = async (text: string, cues: string): Promise<ArrayBuffer> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Narrate this with a ${cues} tone: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Charon' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("A voz falhou.");

  const binaryString = atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const generateImagePanel = async (visualPrompt: string, style: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: `Psychological horror photography: ${visualPrompt}. Style: ${style}, muted colors, high contrast, cinematic, grain, 35mm film look.` }
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("A imagem não se manifestou.");
};

export const editImageWithPrompt = async (base64Data: string, mimeType: string, editPrompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Apply this psychological horror edit: ${editPrompt}. Maintain a dark, moody, cinematic aesthetic. Grainy 35mm film look. Muted colors.`,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("A distorção falhou.");
};

export const animateImageWithVeo = async (base64Data: string, mimeType: string, prompt: string = "Atmospheric horror, subtle movements, eerie shadows"): Promise<string> => {
  const ai = getAiClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Data,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  return operation.response?.generatedVideos?.[0]?.video?.uri || "";
};

export const generateHorrorVideo = async (title: string, visualStyle: string): Promise<string> => {
  const ai = getAiClient();
  const videoPrompt = `Cinematic horror, low key lighting, atmospheric dread, ${visualStyle}. ${title}. Extremely slow zoom, realistic textures.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: videoPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  return operation.response?.generatedVideos?.[0]?.video?.uri || "";
};

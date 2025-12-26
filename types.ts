
export interface Scene {
  scene: string;
  description: string;
}

export interface ComicPanel {
  panelNumber: number;
  caption: string;
  visualPrompt: string;
  imageUrl?: string;
}

export interface GeneratedStory {
  title: string;
  story: string;
  visualStyle: string;
  script: Scene[];
  comicPanels: ComicPanel[];
  narratorCues?: string; // Instruções para a voz do TTS
}

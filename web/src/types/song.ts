export interface Song {
  id: number | string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  audio: string;
  youtubeId?: string;
  theme: {
    primary: string;
    glow: string;
  };
}

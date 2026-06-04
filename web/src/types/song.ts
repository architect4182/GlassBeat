export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  audio: string;
  theme: {
    primary: string;
    glow: string;
  };
}

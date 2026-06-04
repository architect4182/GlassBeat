import type { Song } from '../types/song';

export const songs: Song[] = [
  {
    id: 1,
    title: "Velvet Night",
    artist: "The Midnight Ensemble",
    duration: "4:12",
    cover: "/covers/velvet-night.jpg",
    audio: "/music/velvet-night.mp3",
    theme: {
      primary: "#D4B483",
      glow: "#A67C52",
    },
  },
  {
    id: 2,
    title: "Midnight Waves",
    artist: "Oceanic Sound",
    duration: "3:45",
    cover: "/covers/midnight-waves.jpg",
    audio: "/music/midnight-waves.mp3",
    theme: {
      primary: "#00D4FF",
      glow: "#006B8F",
    },
  },
  {
    id: 3,
    title: "Neon Shadows",
    artist: "Night Shift",
    duration: "5:01",
    cover: "/covers/neon-shadows.jpg",
    audio: "/music/neon-shadows.mp3",
    theme: {
      primary: "#9D4EDD",
      glow: "#5A189A",
    },
  },
];

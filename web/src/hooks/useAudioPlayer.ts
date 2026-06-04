import { useState, useRef, useEffect, useCallback } from 'react';
import type { Song } from '../types/song';

export function useAudioPlayer(initialSongs: Song[]) {
  const [currentSong, setCurrentSong] = useState<Song>(initialSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      
      // Resume if suspended (e.g., iOS)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;

      const audioEl = audioRef.current as any;
      if (!audioEl.__audioSourceNode) {
        audioEl.__audioSourceNode = ctx.createMediaElementAudioSource(audioEl);
      }
      
      const source = audioEl.__audioSourceNode;
      source.disconnect(); // Ensure it's not connected to an old analyser
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Failed to initialize Web Audio API", e);
    }
  }, []);

  // Play/Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    initAudio();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Track selection
  const playSong = useCallback((song: Song) => {
    initAudio();
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  // Next/Prev
  const nextSong = useCallback(() => {
    const currentIndex = initialSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % initialSongs.length;
    playSong(initialSongs[nextIndex]);
  }, [currentSong.id, initialSongs, playSong]);

  const prevSong = useCallback(() => {
    const currentIndex = initialSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + initialSongs.length) % initialSongs.length;
    playSong(initialSongs[prevIndex]);
  }, [currentSong.id, initialSongs, playSong]);

  // Seek
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Sync state with HTMLAudioElement
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying, volume]);

  // Audio Event Handlers
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  const handleVolumeChange = useCallback(() => {
    if (audioRef.current) {
      setVolume(audioRef.current.volume);
    }
  }, []);

  return {
    audioRef,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playSong,
    nextSong,
    prevSong,
    seek,
    setVolume,
    analyserNode: analyserRef.current,
    audioHandlers: {
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleTimeUpdate,
      onVolumeChange: handleVolumeChange,
      onEnded: nextSong,
    }
  };
}

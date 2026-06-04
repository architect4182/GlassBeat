import { useState, useRef, useEffect, useCallback } from 'react';
import type { Song } from '../types/song';

export function useAudioPlayer(initialSongs: Song[]) {
  const [playlist, setPlaylist] = useState<Song[]>(initialSongs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSong = playlist[currentIndex];
  
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
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;

      const audioEl = audioRef.current as any;
      if (!audioEl.__audioSourceNode) {
        audioEl.__audioSourceNode = ctx.createMediaElementSource(audioEl);
      }
      
      const source = audioEl.__audioSourceNode;
      source.disconnect();
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Failed to initialize Web Audio API", e);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    initAudio();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, initAudio]);

  const playSong = useCallback((song: Song) => {
    initAudio();
    setPlaylist(prev => {
      const idx = prev.findIndex(s => s.id === song.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
        return prev;
      } else {
        // Insert new song right after current song
        const newPlaylist = [...prev];
        newPlaylist.splice(currentIndex + 1, 0, song);
        setCurrentIndex(currentIndex + 1);
        return newPlaylist;
      }
    });
    setIsPlaying(true);
  }, [currentIndex, initAudio]);

  const nextSong = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % playlist.length);
  }, [playlist.length]);

  const prevSong = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

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
    playlist,
    currentIndex,
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

import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { songs } from '../data/songs';
import { HomeView } from '../components/views/HomeView/HomeView';
import { PlayerView } from '../components/views/PlayerView/PlayerView';
import { MiniPlayer } from '../components/views/HomeView/MiniPlayer/MiniPlayer';
import YouTubeHiddenPlayer from '../components/YouTubeHiddenPlayer';
import { SearchModal } from '../components/SearchModal';
import { getDominantColor } from '../utils/colorExtractor';
import type { Song } from '../types/song';

interface ViewState {
  isPlayerOpen: boolean;
  glowCursorX: number;
  glowCursorY: number;
}

const AmbientGlowLayer = ({ intensity = 0.3, x = 50, y = 50, color = 'rgba(34, 211, 238' }) => (
  <div
    className="fixed inset-0 pointer-events-none z-0"
    style={{
      background: `radial-gradient(
        circle at ${x}% ${y}%,
        ${color}, ${intensity * 0.15}) 0%,
        ${color}, ${intensity * 0.05}) 35%,
        transparent 70%
      )`,
      transition: "opacity 0.8s ease-in-out, background 0.8s ease-in-out",
    }}
  />
);

export function HomePage() {
  const audio = useAudioPlayer(songs);

  const [viewState, setViewState] = useState<ViewState>({
    isPlayerOpen: false,
    glowCursorX: 50,
    glowCursorY: 50,
  });
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [ytIsPlaying, setYtIsPlaying] = useState(false);
  const [ytCurrentTime, setYtCurrentTime] = useState(0);
  const [ytDuration, setYtDuration] = useState(0);

  const isYouTubeActive = !!audio.currentSong?.youtubeId;

  // Pause native audio when switching to YouTube and vice-versa
  useEffect(() => {
    if (isYouTubeActive && audio.isPlaying) {
      audio.audioRef.current?.pause();
    } else if (!isYouTubeActive && ytIsPlaying && ytPlayer) {
      ytPlayer.pauseVideo();
    }
  }, [audio.currentSong, isYouTubeActive, audio.isPlaying, ytIsPlaying, ytPlayer, audio.audioRef]);

  // Sync YouTube time to state
  useEffect(() => {
    if (!ytIsPlaying || !ytPlayer) return;
    const interval = setInterval(() => {
      setYtCurrentTime(ytPlayer.getCurrentTime() || 0);
    }, 250);
    return () => clearInterval(interval);
  }, [ytIsPlaying, ytPlayer]);

  const handleYtReady = (e: any) => {
    setYtPlayer(e.target);
  };

  const handleYtStateChange = (e: any) => {
    if (e.data === 1) { // Playing
      setYtIsPlaying(true);
      setYtDuration(e.target.getDuration());
    } else {
      setYtIsPlaying(false);
      if (e.data === 0) { // Ended
        audio.nextSong();
      }
    }
  };

  // Unified audio object bridging native and YouTube
  const unifiedAudio = {
    ...audio,
    isPlaying: isYouTubeActive ? ytIsPlaying : audio.isPlaying,
    currentTime: isYouTubeActive ? ytCurrentTime : audio.currentTime,
    duration: isYouTubeActive ? ytDuration : audio.duration,
    togglePlay: () => {
      if (isYouTubeActive) {
        if (ytIsPlaying) ytPlayer?.pauseVideo();
        else ytPlayer?.playVideo();
      } else {
        audio.togglePlay();
      }
    },
    seek: (time: number) => {
      if (isYouTubeActive) {
        ytPlayer?.seekTo(time);
        setYtCurrentTime(time);
      } else {
        audio.seek(time);
      }
    }
  };

  const handleSearchResultClick = async (videoId: string, result: any) => {
    const cover = result.snippet.thumbnails?.high?.url || result.snippet.thumbnails?.medium?.url || '';
    const dominantColor = cover ? await getDominantColor(cover) : '#ef4444';

    const ytSong: Song = {
      id: `yt-${videoId}`,
      title: result.snippet.title,
      artist: result.snippet.channelTitle,
      cover: cover,
      audio: '', // Controlled via YouTube wrapper
      youtubeId: videoId,
      duration: '0:00', 
      theme: { primary: dominantColor, glow: dominantColor } 
    };
    audio.playSong(ytSong);
  };

  const handleTrackClick = (song: Song) => {
    audio.playSong(song);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!viewState.isPlayerOpen) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setViewState((prev) => ({ ...prev, glowCursorX: x, glowCursorY: y }));
    }
  };

  const baseColor = unifiedAudio.currentSong.theme.glow;
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}`;
  };
  const glowColor = baseColor.startsWith('#') ? hex2rgb(baseColor) : 'rgba(34, 211, 238';

  return (
    <div
      className="relative w-full h-screen bg-slate-950 overflow-hidden text-white font-sans"
      onMouseMove={handleMouseMove}
    >
      <audio
        ref={audio.audioRef}
        src={audio.currentSong.audio}
        crossOrigin="anonymous"
        {...audio.audioHandlers}
      />

      {isYouTubeActive && (
        <YouTubeHiddenPlayer
          videoId={audio.currentSong.youtubeId!}
          onReady={handleYtReady}
          onStateChange={handleYtStateChange}
        />
      )}

      {/* Ambient Glow Layer */}
      <AmbientGlowLayer
        intensity={viewState.isPlayerOpen ? 0.8 : 0.4}
        x={viewState.isPlayerOpen ? 50 : viewState.glowCursorX}
        y={viewState.isPlayerOpen ? 50 : viewState.glowCursorY}
        color={glowColor}
      />

      {/* Noise/Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* View Transition Container */}
      <AnimatePresence mode="wait">
        {viewState.isPlayerOpen ? (
          <motion.div
            key="player-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
          >
            <PlayerView
              audio={unifiedAudio}
              onClose={() => setViewState((prev) => ({ ...prev, isPlayerOpen: false }))}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex z-10"
          >
            <HomeView 
              audio={unifiedAudio} 
              onTrackClick={handleTrackClick} 
              onSearchOpen={() => setIsSearchOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onResultClick={handleSearchResultClick} 
      />

      {/* Persistent Mini-Player (Only in Home View) */}
      <AnimatePresence>
        {!viewState.isPlayerOpen && (
          <MiniPlayer
            audio={unifiedAudio}
            isVisible={!!unifiedAudio.currentSong}
            onExpand={() =>
              setViewState((prev) => ({
                ...prev,
                isPlayerOpen: true,
              }))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

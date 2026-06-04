import { useState, useEffect } from 'react';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export function useLyrics(trackTitle: string, artistName: string) {
  const [lyrics, setLyrics] = useState<LyricLine[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackTitle) {
      setLyrics(null);
      return;
    }

    let isMounted = true;

    const fetchLyrics = async () => {
      setIsLoading(true);
      setError(null);
      setLyrics(null);
      
      try {
        // Clean up title for better search
        const cleanTitle = trackTitle.replace(/(\(|\[).*?(official|video|lyric|audio).*?(\)|\])/gi, '').trim();
        
        const params = new URLSearchParams({
          track_name: cleanTitle,
          artist_name: artistName
        });

        const res = await fetch(`https://lrclib.net/api/search?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch lyrics');
        
        const data = await res.json();
        
        if (isMounted) {
          if (data && data.length > 0 && data[0].syncedLyrics) {
            const parsed = parseSyncedLyrics(data[0].syncedLyrics);
            setLyrics(parsed);
          } else {
            setError("No synchronized lyrics found.");
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to fetch lyrics");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLyrics();

    return () => {
      isMounted = false;
    };
  }, [trackTitle, artistName]);

  return { lyrics, isLoading, error };
}

function parseSyncedLyrics(lrc: string): LyricLine[] {
  const lines = lrc.split('\n');
  const parsed: LyricLine[] = [];
  
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  
  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
      
      const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, '').trim();
      
      if (text) {
        parsed.push({ time: timeInSeconds, text });
      }
    }
  }
  
  return parsed;
}

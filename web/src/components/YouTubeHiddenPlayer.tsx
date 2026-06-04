import YouTube from "react-youtube";

export default function YouTubeHiddenPlayer({
  videoId,
  onReady,
  onStateChange,
}: {
  videoId: string;
  onReady?: (event: any) => void;
  onStateChange?: (event: any) => void;
}) {
  return (
    <div style={{ display: "none" }}>
      <YouTube
        videoId={videoId}
        opts={{
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useRUM } from '../hooks/useRUM';

export const YouTubeEmbed: React.FC = () => {
  const { recordEvent } = useRUM();
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // Track YouTube playlist view (only once)
    if (!hasTrackedView.current) {
      recordEvent('youtube_playlist_view', {});
      hasTrackedView.current = true;
    }
  }, [recordEvent]);

  const handleIframeInteraction = () => {
    // Track when user interacts with the YouTube embed
    recordEvent('youtube_playlist_interaction', {});
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block" role="complementary" aria-label="Background music playlist">
      <div className="relative rounded-card overflow-hidden border border-white/20 shadow-2xl bg-black/90 backdrop-blur-sm">
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded text-xs text-white/80 z-10 font-['Audiowide']" aria-hidden="true">
          🎵 Vibe Playlist
        </div>
        <iframe 
          className="w-80 h-48"
          src="https://www.youtube.com/embed/videoseries?si=HPH4YqbyRTiUCcUE&amp;list=PL_FQk-lMytvI8hwX4q6SJ0XvLr5mxa0DQ" 
          title="Vibe Playlist - Background music" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
          onMouseEnter={handleIframeInteraction}
          onFocus={handleIframeInteraction}
        />
      </div>
    </div>
  );
};

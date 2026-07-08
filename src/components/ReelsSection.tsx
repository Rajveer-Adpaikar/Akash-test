import { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const REELS = [
  '1208158883',
  '1208158917',
  '1208158916',
  '1208158881',
  '1208158886',
  '1208158884',
];

export default function ReelsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<Map<string, any>>(new Map());
  const [muted, setMuted] = useState(true);
  const [visibleId, setVisibleId] = useState<string | null>(null);

  // Observer to track which reel is in view
  useEffect(() => {
    const players = playersRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-reel-id');
          if (!id) return;
          const player = players.get(id);
          if (!player) return;
          if (entry.isIntersecting) {
            setVisibleId(id);
            player.play();
          } else if (visibleId === id) {
            player.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    const cards = scrollRef.current?.querySelectorAll('[data-reel-id]');
    cards?.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [visibleId]);

  // Init Vimeo players on mount
  useEffect(() => {
    const players = playersRef.current;
    const cards = scrollRef.current?.querySelectorAll('[data-reel-id]');
    cards?.forEach((el) => {
      const id = el.getAttribute('data-reel-id');
      if (!id || players.has(id)) return;
      const iframe = el.querySelector('iframe');
      if (!iframe) return;
      const player = new (window as any).Vimeo.Player(iframe);
      player.ready().then(() => {
        player.setVolume(0);
        players.set(id, player);
      });
    });
    return () => { players.forEach((p: any) => p.destroy()); players.clear(); };
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      playersRef.current.forEach((p: any) => p.setVolume(next ? 0.7 : 0));
      return next;
    });
  }, []);

  return (
    <section className="bg-black px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 overflow-hidden" id="reels">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-primary text-xl sm:text-2xl md:text-3xl text-center mb-2">
          Event Reels
        </h2>
        <p className="text-white/40 text-xs text-center mb-6 sm:mb-8">Swipe to view more →</p>

        {/* Scroll wrapper — centers the grid on desktop */}
        <div className="flex justify-center">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin max-w-full"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
          >
            {REELS.map((id, i) => (
              <div
                key={id}
                data-reel-id={id}
                className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-center rounded-2xl overflow-hidden bg-[#101010]"
              >
                <div style={{ padding: '177.78% 0 0 0', position: 'relative' }}>
                  <iframe
                    src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&background=1`}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                    }}
                    title={`Reel ${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mute/Unmute button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors"
            aria-label={muted ? 'Unmute reels' : 'Mute reels'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {muted ? 'Unmute reels' : 'Mute reels'}
          </button>
        </div>
      </div>
    </section>
  );
}

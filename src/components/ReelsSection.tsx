import { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const REELS = [
  '1208158925',
  '1208158917',
  '1208158916',
  '1208158881',
  '1208158886',
  '1208158884',
  '1208158883',
];

function initPlayer(iframe: HTMLIFrameElement): Promise<any> {
  return new Promise((resolve) => {
    const player = new (window as any).Vimeo.Player(iframe);
    player.ready().then(() => resolve(player));
  });
}

export default function ReelsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<Map<string, any>>(new Map());
  const activeIdRef = useRef<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Lazy-init players when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || loaded) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, [loaded]);

  // Init players (runs once after lazy-load triggers)
  useEffect(() => {
    if (!loaded) return;
    const players = playersRef.current;
    const cards = scrollRef.current?.querySelectorAll('[data-reel-id]');
    let readyCount = 0;
    const total = cards?.length || 0;

    cards?.forEach((el) => {
      const id = el.getAttribute('data-reel-id');
      if (!id || players.has(id)) return;
      const iframe = el.querySelector('iframe');
      if (!iframe) return;
      // Swap placeholder for real video src
      iframe.src = `https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&background=1`;

      initPlayer(iframe).then((player) => {
        player.setVolume(0)
          .then(() => player.pause())
          .then(() => {
            if (id === '1208158886') return player.setCurrentTime(1);
          })
          .then(() => {
            players.set(id, player);
            readyCount++;
            if (readyCount === total) {
              const first = scrollRef.current?.querySelector('[data-reel-id]');
              const fid = first?.getAttribute('data-reel-id');
              if (fid && players.has(fid)) {
                const rect = first!.getBoundingClientRect();
                const sw = scrollRef.current!;
                const sRect = sw.getBoundingClientRect();
                if (rect.left >= sRect.left && rect.right <= sRect.right) {
                  players.get(fid).play();
                  activeIdRef.current = fid;
                }
              }
            }
          });
      });
    });
    return () => { players.forEach((p: any) => p.destroy()); players.clear(); };
  }, [loaded]);

  // Scroll-based active detection
  useEffect(() => {
    const sw = scrollRef.current;
    if (!sw) return;
    const players = playersRef.current;

    const check = () => {
      const cards = sw.querySelectorAll<HTMLElement>('[data-reel-id]');
      let bestId: string | null = null;
      let bestDist = Infinity;
      const swRect = sw.getBoundingClientRect();
      const swCenter = swRect.left + swRect.width / 2;

      cards.forEach((el) => {
        const id = el.getAttribute('data-reel-id');
        if (!id) return;
        const elRect = el.getBoundingClientRect();
        const elCenter = elRect.left + elRect.width / 2;
        const dist = Math.abs(swCenter - elCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      });

      if (bestId && bestId !== activeIdRef.current) {
        if (activeIdRef.current && players.has(activeIdRef.current)) {
          players.get(activeIdRef.current).pause();
        }
        if (players.has(bestId)) {
          players.get(bestId).play();
        }
        activeIdRef.current = bestId;
      }
    };

    let attempts = 0;
    const initialCheck = () => {
      const anyPlayerReady = Array.from(sw.querySelectorAll('[data-reel-id]')).some(
        (el) => players.has(el.getAttribute('data-reel-id') || '')
      );
      if (anyPlayerReady || attempts > 10) {
        check();
      } else {
        attempts++;
        setTimeout(initialCheck, 300);
      }
    };
    setTimeout(initialCheck, 500);

    sw.addEventListener('scroll', check, { passive: true });
    return () => { sw.removeEventListener('scroll', check); };
  }, [loaded]);

  // Listen: when hero unmutes, auto-mute reels
  useEffect(() => {
    const handler = () => {
      playersRef.current.forEach((p: any) => p.setVolume(0));
      setMuted(true);
    };
    window.addEventListener('mute-reels' as any, handler as any);
    return () => window.removeEventListener('mute-reels' as any, handler as any);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      playersRef.current.forEach((p: any) => p.setVolume(next ? 0 : 0.7));
      if (!next) {
        window.dispatchEvent(new CustomEvent('mute-hero'));
      }
      return next;
    });
  }, []);

  return (
    <section ref={sectionRef} className="bg-black px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 overflow-hidden" id="reels">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-primary text-xl sm:text-2xl md:text-3xl text-center mb-2">
          Event Reels
        </h2>
        <p className="text-white/40 text-xs text-center mb-6 sm:mb-8">Swipe to view more →</p>

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
                <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    src={loaded ? `https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&background=1` : 'about:blank'}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title={`Reel ${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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

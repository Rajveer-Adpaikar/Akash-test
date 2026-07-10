import { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const REELS = [
  { vimeo: '1208158925', instagram: 'https://www.instagram.com/reel/DX9Zme3sYPV/' },
  { vimeo: '1208158917', instagram: 'https://www.instagram.com/reel/DTzWuQPDDwR/' },
  { vimeo: '1208158916', instagram: 'https://www.instagram.com/reel/DZC7xYMSejP/' },
  { vimeo: '1208158881', instagram: 'https://www.instagram.com/reel/DVlh_pwj-PQ/' },
  { vimeo: '1208158886', instagram: 'https://www.instagram.com/reel/DaVXSECMIhq/' },
  { vimeo: '1208158884', instagram: 'https://www.instagram.com/reel/DTu73e9jKsg/' },
  { vimeo: '1208158883', instagram: 'https://www.instagram.com/reel/DTUx2xBDNxD/' },
];

const LOAD_RETRIES = 2;
const READY_TIMEOUT = 10000;

interface PlayerResult {
  id: string;
  player: any;
}

function initReelPlayer(el: Element, retriesLeft = LOAD_RETRIES): Promise<PlayerResult | null> {
  return new Promise((resolve) => {
    const id = el.getAttribute('data-reel-id');
    if (!id) return resolve(null);

    const iframe = el.querySelector<HTMLIFrameElement>('iframe');
    if (!iframe || iframe.src) return resolve(null);

    iframe.src = `https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&background=1`;

    let done = false;

    const finish = (err?: boolean) => {
      if (done) return;
      done = true;
      if (err && retriesLeft > 0) {
        iframe.src = '';
        setTimeout(() => resolve(initReelPlayer(el, retriesLeft - 1)), 1000);
      } else if (err) {
        resolve(null);
      }
    };

    const player = new (window as any).Vimeo.Player(iframe);
    const timer = setTimeout(() => finish(true), READY_TIMEOUT);

    player.ready()
      .then(() => {
        clearTimeout(timer);
        if (done) return;
        done = true;
        player.setVolume(0).then(() => player.pause());
        if (id === '1208158886') player.setCurrentTime(1);
        resolve({ id, player });
      })
      .catch(() => {
        clearTimeout(timer);
        finish(true);
      });
  });
}

/** Find the card element for a given array index */
function cardAtIndex(scrollEl: HTMLElement, index: number): HTMLElement | null {
  return scrollEl.querySelector<HTMLElement>(`[data-reel-id="${REELS[index]?.vimeo}"]`);
}

/** Smooth-scroll to center a card at the given index (respecting snap-center) */
function scrollToIndex(scrollEl: HTMLElement, index: number) {
  const card = cardAtIndex(scrollEl, index);
  if (!card) return;
  // Calculate the scrollLeft that aligns this card's center with the container center
  const targetLeft = card.offsetLeft + card.offsetWidth / 2 - scrollEl.clientWidth / 2;
  scrollEl.scrollTo({ left: targetLeft, behavior: 'smooth' });
}

export default function ReelsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<Map<string, any>>(new Map());
  const activeIndexRef = useRef<number>(-1);
  const hasInitializedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(true);
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const touchRef = useRef<{ startX: number } | null>(null);

  const startPlayer = useCallback((el: Element) => {
    const players = playersRef.current;
    const id = el.getAttribute('data-reel-id');
    if (!id || players.has(id)) return;
    initReelPlayer(el).then((result) => {
      if (!result) {
        setFailedIds((prev) => new Set(prev).add(id));
        return;
      }
      players.set(result.id, result.player);
      setReadyIds((prev) => new Set(prev).add(result.id));
    });
  }, []);

  // Eagerly init first 2 reels on mount — no waiting for IntersectionObserver
  useEffect(() => {
    const sw = scrollRef.current;
    if (!sw) return;
    const cards = sw.querySelectorAll<HTMLElement>('[data-reel-id]');

    cards.forEach((el, i) => {
      if (i >= 2) return;
      const check = () => {
        if ((window as any).Vimeo?.Player) {
          startPlayer(el);
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });

    // Stagger init for reels 3-7 to avoid Vimeo channel contention
    cards.forEach((el, i) => {
      if (i < 2) return;
      setTimeout(() => {
        const checkSDK = () => {
          if ((window as any).Vimeo?.Player) {
            startPlayer(el);
          } else {
            requestAnimationFrame(checkSDK);
          }
        };
        checkSDK();
      }, i * 500);
    });
  }, [startPlayer]);

  // Auto-play first reel as soon as its player is ready
  useEffect(() => {
    if (hasInitializedRef.current) return;
    const players = playersRef.current;
    const sw = scrollRef.current;
    if (!sw || !players.has(REELS[0].vimeo)) return;

    players.get(REELS[0].vimeo).play();
    activeIndexRef.current = 0;
    hasInitializedRef.current = true;
    scrollToIndex(sw, 0);
  }, [readyIds]);

  // Block mouse-wheel / trackpad scrolling on the reel track
  useEffect(() => {
    const sw = scrollRef.current;
    if (!sw) return;
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault();
    };
    sw.addEventListener('wheel', handler, { passive: false });
    return () => sw.removeEventListener('wheel', handler);
  }, []);

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
      if (!next) window.dispatchEvent(new CustomEvent('mute-hero'));
      return next;
    });
  }, []);

  // --- Both interaction paths (buttons + touch swipe) use the same ±1 logic ---

  const activateByDelta = useCallback((dir: -1 | 1) => {
    const sw = scrollRef.current;
    const players = playersRef.current;
    if (!sw || players.size === 0) return;

    const cur = activeIndexRef.current;
    const from = cur >= 0 ? cur : 0;
    const target = Math.max(0, Math.min(REELS.length - 1, from + dir));
    if (target === from) return;

    const newId = REELS[target]?.vimeo;
    if (!newId || !players.has(newId)) return;

    if (from >= 0) {
      const oldId = REELS[from]?.vimeo;
      if (oldId && players.has(oldId)) players.get(oldId).pause();
    }
    players.get(newId).play();
    activeIndexRef.current = target;
    scrollToIndex(sw, target);
  }, []);

  const scrollLeft = useCallback(() => activateByDelta(-1), [activateByDelta]);
  const scrollRight = useCallback(() => activateByDelta(1), [activateByDelta]);

  // Touch swipe — same ±1 logic as buttons, no geometry
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchRef.current = { startX: e.touches[0].clientX };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchRef.current.startX);
    if (dx > 20) e.preventDefault();
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const t = touchRef.current;
    if (!t) return;
    const dx = e.changedTouches[0].clientX - t.startX;
    touchRef.current = null;
    if (Math.abs(dx) < 30) return;
    activateByDelta(dx > 0 ? -1 : 1);
  }, [activateByDelta]);

  return (
    <section ref={sectionRef} className="bg-black px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20" id="reels">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-primary text-xl sm:text-2xl md:text-3xl text-center mb-2" style={{ textWrap: 'balance' }}>
          Event Reels
        </h2>
        <p className="text-white/40 text-xs text-center mb-6 sm:mb-8">Tap arrows or swipe to browse</p>

        <div className="relative flex justify-center">
          {/* Previous button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous reel"
            className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 sm:w-9 sm:h-9 -ml-3.5 sm:-ml-5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide max-w-full touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {REELS.map((r, i) => {
              const id = r.vimeo;
              const loaded = readyIds.has(id);
              const failed = failedIds.has(id);
              return (
                <div
                  key={id}
                  data-reel-id={id}
                  className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-center rounded-2xl overflow-hidden bg-[#101010]"
                >
                  <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
                    {!loaded && !failed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#181818] rounded-2xl z-10">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
                      </div>
                    )}
                    {failed && (
                      <a
                        href={r.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex flex-col items-center justify-center bg-[#181818] rounded-2xl z-10 gap-2 p-4 hover:bg-[#222] transition-colors"
                      >
                        <AlertTriangle className="w-6 h-6 text-white/30" />
                        <p className="text-white/30 text-xs text-center">Open in Instagram</p>
                      </a>
                    )}
                    <iframe
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      title={`Reel ${i + 1}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={scrollRight}
            aria-label="Next reel"
            className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 sm:w-9 sm:h-9 -mr-3.5 sm:-mr-5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
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

import { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import InquiryModal from './InquiryModal';

interface ReelData {
  vimeo: string;
  instagram?: string;
  caption?: string;
}

const REELS: ReelData[] = [
  { vimeo: '1208819326', caption: 'Latest performance highlight' },
  { vimeo: '1208158917', instagram: 'https://www.instagram.com/reel/DTzWuQPDDwR/', caption: 'Live at a Goan destination' },
  { vimeo: '1208158916', instagram: 'https://www.instagram.com/reel/DZC7xYMSejP/', caption: 'High-energy performance with Papon' },
  { vimeo: '1208158881', instagram: 'https://www.instagram.com/reel/DVlh_pwj-PPQ/', caption: 'Corporate event performance' },
  { vimeo: '1208158886', instagram: 'https://www.instagram.com/reel/DaVXSECMIhq/', caption: 'Wedding sangeet highlights' },
  { vimeo: '1208819325', caption: 'Romantic Bollywood cover' },
  { vimeo: '1208819327', caption: 'Romantic moments made musical' },
];

const LOAD_RETRIES = 2;
const READY_TIMEOUT = 10000;

const NUM_REALS = REELS.length;
const FIRST_REAL = 1;
const LAST_REAL = NUM_REALS;
const SNAP_MS = 350;

interface PlayerResult {
  id: string;
  player: VimeoPlayer;
}

function initReelPlayer(el: Element, retriesLeft = LOAD_RETRIES): Promise<PlayerResult | null> {
  return new Promise((resolve) => {
    const id = el.getAttribute('data-reel-id');
    if (!id) return resolve(null);

    const iframe = el.querySelector<HTMLIFrameElement>('iframe');
    if (!iframe) return resolve(null);

    // src is already set eagerly in JSX — just attach the Player SDK
    let done = false;

    const finish = (err?: boolean) => {
      if (done) return;
      done = true;
      if (err && retriesLeft > 0) {
        setTimeout(() => resolve(initReelPlayer(el, retriesLeft - 1)), 1000);
      } else if (err) {
        resolve(null);
      }
    };

    try {
      const player = new window.Vimeo!.Player(iframe);
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
    } catch {
      finish(true);
    }
  });
}

function buildSlots() {
  const slots: { key: string; vimeo: string; instagram?: string; caption?: string; isClone: boolean }[] = [];
  slots.push({ key: `${REELS[NUM_REALS - 1].vimeo}-clone-end`, ...REELS[NUM_REALS - 1], isClone: true });
  for (let i = 0; i < NUM_REALS; i++) {
    slots.push({ key: REELS[i].vimeo, ...REELS[i], isClone: false });
  }
  slots.push({ key: `${REELS[0].vimeo}-clone-start`, ...REELS[0], isClone: true });
  return slots;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<Map<string, VimeoPlayer>>(new Map());
  const activeKeyRef = useRef<string | null>(null);
  const slotRef = useRef(FIRST_REAL);
  const movingRef = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [muted, setMuted] = useState(true);
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [showInquiry, setShowInquiry] = useState(false);

  // ── Player init — all in parallel, no stagger ─────────────

  const startPlayer = useCallback((el: Element) => {
    const players = playersRef.current;
    const key = el.getAttribute('data-player-key');
    const id = el.getAttribute('data-reel-id');
    const isClone = el.getAttribute('data-clone') === 'true';
    if (!key || !id || players.has(key) || isClone) return;
    initReelPlayer(el).then((result) => {
      if (!result) {
        setFailedIds((prev) => new Set(prev).add(key));
        return;
      }
      players.set(key, result.player);
      setReadyIds((prev) => new Set(prev).add(key));
    });
  }, []);

  useEffect(() => {
    const cards = outerRef.current?.querySelectorAll<HTMLElement>('[data-player-key]');
    if (!cards) return;

    const waitVimeo = (fn: () => void) => {
      if (window.Vimeo?.Player) fn();
      else requestAnimationFrame(() => waitVimeo(fn));
    };

    waitVimeo(() => {
      // Init ALL players in parallel
      cards.forEach((el) => startPlayer(el));
    });
  }, [startPlayer]);

  // ── Snap ──────────────────────────────────────────────────

  const snap = useCallback((slot: number, animated: boolean) => {
    const outer = outerRef.current;
    const tray = trayRef.current;
    if (!outer || !tray) return;

    const el = tray.children[slot] as HTMLElement | undefined;
    if (!el) return;

    const outerW = outer.offsetWidth;
    const elLeft = el.offsetLeft;
    const elW = el.offsetWidth;
    const offset = outerW / 2 - (elLeft + elW / 2);

    slotRef.current = slot;

    if (animated) {
      tray.style.transition = `transform ${SNAP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    } else {
      tray.style.transition = 'none';
    }
    tray.style.transform = `translateX(${offset}px)`;
    if (!animated) tray.offsetHeight;
  }, []);

  useEffect(() => {
    const t = setTimeout(() => snap(FIRST_REAL, false), 100);
    return () => clearTimeout(t);
  }, [snap]);

  // ── Auto-play reel 1 once ready ───────────────────────────

  useEffect(() => {
    const firstKey = buildSlots()[FIRST_REAL].key;
    let retries = 0;
    const MAX_RETRIES = 10;

    const tryPlay = (): boolean => {
      const player = playersRef.current.get(firstKey);
      if (!player) return false;
      player.setVolume(muted ? 0 : 0.7);
      player.play();
      activeKeyRef.current = firstKey;
      return true;
    };

    const interval = setInterval(() => {
      if (tryPlay() || retries >= MAX_RETRIES) clearInterval(interval);
      retries++;
    }, 300);

    return () => clearInterval(interval);
  }, [readyIds, muted]);

  // ── Mute sync: hero unmutes → dispatch mute-reels (video in ReelsSection mutes) ──
  //     When video unmutes → receive mute-hero → mute ourselves
  useEffect(() => {
    const handler = () => {
      playersRef.current.forEach((p) => p.setVolume(0));
      setMuted(true);
    };
    window.addEventListener('mute-hero', handler);
    return () => window.removeEventListener('mute-hero', handler);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      playersRef.current.forEach((p) => p.setVolume(next ? 0 : 0.7));
      if (!next) window.dispatchEvent(new CustomEvent('mute-reels'));
      return next;
    });
  }, []);

  // ── Navigate ──────────────────────────────────────────────

  const navigate = useCallback((dir: -1 | 1) => {
    if (movingRef.current) return;
    movingRef.current = true;

    const current = slotRef.current;
    const nextSlot = current + dir;
    const slots = buildSlots();

    if (nextSlot < FIRST_REAL || nextSlot > LAST_REAL) {
      const target = dir === -1 ? LAST_REAL : FIRST_REAL;
      snap(target, false);
      if (activeKeyRef.current && playersRef.current.has(activeKeyRef.current)) {
        playersRef.current.get(activeKeyRef.current)?.pause();
      }
      const nextPlayer = playersRef.current.get(slots[target].key);
      if (nextPlayer) {
        nextPlayer.setVolume(muted ? 0 : 0.7);
        nextPlayer.play();
      }
      activeKeyRef.current = slots[target].key;
      movingRef.current = false;
      return;
    }

    snap(nextSlot, true);

    const onDone = () => {
      movingRef.current = false;
      const key = slots[nextSlot].key;
      const player = playersRef.current.get(key);
      if (player && key !== activeKeyRef.current) {
        if (activeKeyRef.current && playersRef.current.has(activeKeyRef.current)) {
          playersRef.current.get(activeKeyRef.current)?.pause();
        }
        player.setVolume(muted ? 0 : 0.7);
        player.play();
        activeKeyRef.current = key;
      }
    };
    setTimeout(onDone, SNAP_MS + 50);
  }, [snap, muted]);

  const scrollLeft = useCallback(() => navigate(-1), [navigate]);
  const scrollRight = useCallback(() => navigate(1), [navigate]);

  // ── Touch swipe ──────────────────────────────────────────

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 20) e.preventDefault();
  }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 30) return;
    navigate(dx > 0 ? -1 : 1);
  }, [navigate]);

  // ── Render ────────────────────────────────────────────────

  const slots = buildSlots();

  return (
    <section id="hero" ref={sectionRef} className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Skip to content link */}
      <a href="#about" className="skip-link">
        Skip to main content
      </a>

      <h1 className="sr-only">Akash The Band — Goa's Premier Bollywood Band for Destination Weddings &amp; Corporate Events | Live Bollywood Music India</h1>

      {/* Navbar */}
      <nav aria-label="Main navigation" className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {[
              { label: 'About', href: '#about' },
              { label: 'Events', href: '#reels' },
              { label: 'Services', href: '#services' },
              { label: 'Contact', href: '#contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={`${item.label} section`}
                className="nav-link text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-colors duration-200 text-[#E1E0CC] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mute toggle — top right */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200"
        aria-label={muted ? 'Unmute reels' : 'Mute reels'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Reels carousel — centered in viewport */}
      <div className="h-full flex items-center justify-center pt-14 pb-4">
        <div className="relative w-full max-w-6xl">
          <button
            onClick={scrollLeft}
            aria-label="Previous reel"
            className="flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-11 h-11 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div ref={outerRef} className="overflow-hidden w-full">
            <div
              ref={trayRef}
              className="flex gap-3 sm:gap-4"
              style={{ willChange: 'transform' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {slots.map((s) => {
                const loaded = readyIds.has(s.key);
                const failed = failedIds.has(s.key);
                return (
                  <div
                    key={s.key}
                    data-player-key={s.key}
                    data-reel-id={s.vimeo}
                    data-clone={s.isClone ? 'true' : undefined}
                    className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] rounded-2xl overflow-hidden bg-[#101010]"
                  >
                    <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
                      {!s.isClone && !loaded && !failed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#181818] rounded-2xl z-10">
                          <div className="w-6 h-6 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
                        </div>
                      )}
                      {failed && s.instagram && (
                        <a
                          href={s.instagram}
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
                        title={s.caption || `Reel ${s.key}`}
                        src={`https://player.vimeo.com/video/${s.vimeo}?badge=0&autopause=0&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1&muted=1`}
                      />
                    </div>
                    {s.caption && !s.isClone && (
                      <p className="text-white/50 text-[10px] sm:text-xs text-center py-2 px-2 truncate">
                        {s.caption}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={scrollRight}
            aria-label="Next reel"
            className="flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-11 h-11 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <InquiryModal open={showInquiry} onClose={() => setShowInquiry(false)} />
    </section>
  );
}

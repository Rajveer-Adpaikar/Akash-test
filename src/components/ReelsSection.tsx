import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import InquiryModal from './InquiryModal';

export default function ReelsSection() {
  const [muted, setMuted] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || playerRef.current) return;
    const iframe = wrapperRef.current.querySelector('iframe');
    if (!iframe) return;

    const waitVimeo = (fn: () => void) => {
      if (window.Vimeo?.Player) fn();
      else requestAnimationFrame(() => waitVimeo(fn));
    };

    waitVimeo(() => {
      const player = new window.Vimeo!.Player(iframe);
      player.ready().then(() => {
        player.setCurrentTime(1);
        setVideoReady(true);
        if (wrapperRef.current) wrapperRef.current.classList.remove('opacity-0');
      });
      playerRef.current = player;
    });
  }, []);

  // Listen: when reels (hero) unmute, auto-mute this video
  useEffect(() => {
    const handler = () => {
      const player = playerRef.current;
      if (!player) return;
      player.setVolume(0);
      setMuted(true);
    };
    window.addEventListener('mute-reels', handler);
    return () => window.removeEventListener('mute-reels', handler);
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const nextMuted = !muted;
    if (nextMuted) {
      player.setVolume(0);
    } else {
      player.setVolume(0.7);
      // This video unmuted → tell hero (reels) to mute
      window.dispatchEvent(new CustomEvent('mute-hero'));
    }
    setMuted(nextMuted);
  }, [muted]);

  return (
    <section id="reels" className="bg-black px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Video player */}
        <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-black">
          {/* Loading spinner */}
          {!videoReady && (
            <div className="absolute inset-0 z-[2] flex items-center justify-center" aria-hidden="true">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Vimeo iframe */}
          <div
            className="relative w-full opacity-0 transition-opacity duration-500"
            ref={wrapperRef}
            style={{ paddingTop: '56.25%' }}
          >
            <iframe
              src="https://player.vimeo.com/video/1208327096?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              title="SAPNA JAHAN AKASH MANGUESHKAR COVER SONU NIGAM AJAY ATUL AKSHAY KUMAR BROTHERS - Akash_TheBand"
            />
          </div>

          {/* Overlays */}
          <div className="noise-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

          {/* Mute/Unmute button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200"
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Text + CTA below video */}
        <div className="mt-8 md:mt-10">
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            Goa&apos;s premier Bollywood ensemble — a 6-piece band bringing
            high-energy live performances, romantic covers, and unforgettable
            entertainment to destination weddings and corporate events across India.
          </p>
          <button
            onClick={() => setShowInquiry(true)}
            className="group inline-flex items-center gap-2 bg-primary rounded-full text-black font-medium text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 hover:gap-3 mt-6 shadow-xl shadow-black/40"
          >
            Inquire Now
            <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </span>
          </button>
        </div>
      </div>

      <InquiryModal open={showInquiry} onClose={() => setShowInquiry(false)} />
    </section>
  );
}

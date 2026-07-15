import { useRef, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ReelsSection from './components/ReelsSection';
import FeaturesSection from './components/FeaturesSection';
import FooterSection from './components/FooterSection';
import { MessageCircle, Phone } from 'lucide-react';

function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-auto md:right-6 md:flex md:flex-col md:gap-3">
      <div className="flex md:flex-col gap-2 p-3 md:p-0">
        <a
          href="https://wa.me/919923837062"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-medium px-4 py-3 md:py-2.5 md:px-5 rounded-xl md:rounded-full shadow-lg hover:brightness-110 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="md:hidden">Chat on WhatsApp</span>
          <span className="hidden md:inline">WhatsApp</span>
        </a>
        <a
          href="tel:+919923837062"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-black text-sm font-medium px-4 py-3 md:py-2.5 md:px-5 rounded-xl md:rounded-full shadow-lg hover:brightness-110 transition-all"
        >
          <Phone className="w-4 h-4" />
          <span className="md:hidden">Call Now</span>
          <span className="hidden md:inline">+91 99238 37062</span>
        </a>
      </div>
    </div>
  );
}

function SocialProofBar() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const item = (label: string, sub: string) => (
    <div className="flex items-center shrink-0 gap-6">
      <div className="text-center">
        <p className="text-primary text-lg sm:text-xl font-bold leading-none">{label}</p>
        <p className="text-white/40 text-[10px] sm:text-xs whitespace-nowrap">{sub}</p>
      </div>
      <div className="w-px h-8 bg-white/10 shrink-0" />
    </div>
  );

  const allItems = [
    { label: '796K', sub: 'Instagram Views' },
    { label: '32K', sub: 'Likes' },
    { label: '6', sub: 'Musicians' },
    { label: 'Birla White', sub: 'Corporate Client' },
  ];

  const renderItems = () => allItems.map((i) => <div key={i.label}>{item(i.label, i.sub)}</div>);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let pos = 0;
    let id: number;
    const step = () => {
      pos -= 0.5;
      const half = el.scrollWidth / 2;
      if (pos <= -half) pos += half;
      el.style.transform = `translateX(${pos}px)`;
      id = requestAnimationFrame(step);
    };
    // Start after a brief delay so layout is settled
    const start = setTimeout(() => { id = requestAnimationFrame(step); }, 100);
    return () => { clearTimeout(start); cancelAnimationFrame(id); };
  }, []);

  return (
    <div className="bg-[#101010] border-y border-white/5 py-5">
      <div className="hidden md:block max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-center gap-8">
          {renderItems()}
        </div>
      </div>
      <div className="md:hidden overflow-hidden">
        <div ref={marqueeRef} className="flex gap-6" style={{ willChange: 'transform' }}>
          {renderItems()}
          {renderItems()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <HeroSection />
      <SocialProofBar />
      <AboutSection />
      <ReelsSection />
      <FeaturesSection />
      <FooterSection />
      <FloatingCTA />
    </div>
  );
}

export default App;

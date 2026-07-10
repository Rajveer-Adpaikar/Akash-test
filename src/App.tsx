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
  return (
    <div className="bg-[#101010] border-y border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
          <div>
            <p className="text-primary text-lg sm:text-xl font-display font-bold">738K</p>
            <p className="text-white/40 text-[10px] sm:text-xs">YouTube Views</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-primary text-lg sm:text-xl font-display font-bold">31K</p>
            <p className="text-white/40 text-[10px] sm:text-xs">Likes</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-primary text-lg sm:text-xl font-display font-bold">6</p>
            <p className="text-white/40 text-[10px] sm:text-xs">Musicians</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-primary text-lg sm:text-xl font-display font-bold">Birla White</p>
            <p className="text-white/40 text-[10px] sm:text-xs">Corporate Client</p>
          </div>
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

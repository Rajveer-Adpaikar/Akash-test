import { Phone, Mail, Music2 } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="bg-black border-t border-white/10 px-4 sm:px-6 md:px-8 py-10" id="contact">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Music2 className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium text-sm uppercase tracking-widest">
            Akash The Band
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs sm:text-sm">
          <a href="https://instagram.com/akash_theband" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors">
            Instagram
          </a>
          <a href="tel:+919923837062" className="flex items-center gap-1.5 text-white/60 hover:text-primary transition-colors">
            <Phone className="w-3.5 h-3.5" />
            +91 99238 37062
          </a>
          <a href="mailto:kanwarbharat@gmail.com" className="flex items-center gap-1.5 text-white/60 hover:text-primary transition-colors">
            <Mail className="w-3.5 h-3.5" />
            Email
          </a>
        </div>

        <p className="text-white/30 text-[10px] sm:text-xs">
          &copy; {new Date().getFullYear()} Akash The Band
        </p>
      </div>
    </footer>
  );
}

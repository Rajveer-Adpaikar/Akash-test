import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const bodyText =
  'Performed with Papon at a Goa concert — 738K views, 31K likes. Our band of 6 seasoned musicians (lead vocals, female vocals, keys, bass, lead guitar, drums) plus professional sound production delivers Bollywood hits, romantic covers, and high-energy live sets that turn every event into an unforgettable experience.';

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <section className="bg-black px-4 sm:px-6 md:px-8 py-1 sm:py-20 md:py-28" id="about">
      <div className="bg-[#101010] rounded-3xl sm:rounded-[2rem] px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 max-w-6xl mx-auto">
        {/* Label */}
        <p className="text-white/80 text-[10px] sm:text-xs uppercase tracking-widest mb-8 sm:mb-10 md:mb-12 text-center">
          Frontman — Akash The Band
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Image */}
          <div className="w-full">
            <img
              src={`${import.meta.env.BASE_URL}akash-portrait.jpg?v=2`}
              alt="Akash Mangeshkar"
              className="w-full h-auto rounded-2xl object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div>
            {/* Intro paragraph */}
            <p className="font-body text-base sm:text-lg md:text-xl leading-relaxed text-[#E1E0CC] text-left mb-8">
              I am Akash Mangeshkar, a playback singer &amp; frontman. I lead Goa's premier Bollywood ensemble for luxury weddings and corporate events.
            </p>

            {/* Body — scroll-reveal with ghost backdrop */}
            <div ref={ref} className="relative max-w-2xl min-h-[6em]">
              <p
                className="text-xs sm:text-sm md:text-base text-[#DEDBC8] leading-relaxed text-left"
                style={{ opacity: 0.2 }}
                aria-hidden="true"
              >
                {bodyText}
              </p>
              <motion.p
                className="absolute inset-0 text-xs sm:text-sm md:text-base text-[#DEDBC8] leading-relaxed text-left"
                style={{ opacity }}
              >
                {bodyText}
              </motion.p>
            </div>

            {/* Band lineup */}
            <div className="mt-8 sm:mt-10">
              <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-widest mb-4">The Lineup</p>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { role: 'Lead Vocals', icon: '🎤' },
                  { role: 'Female Vocals', icon: '🎤' },
                  { role: 'Keys', icon: '🎹' },
                  { role: 'Bass', icon: '🎸' },
                  { role: 'Lead Guitar', icon: '🎸' },
                  { role: 'Drums', icon: '🥁' },
                  { role: 'FOH', icon: '🔊' },
                  { role: 'Production', icon: '🎛️' },
                ].map((member) => (
                  <div
                    key={member.role}
                    className="bg-black/40 rounded-xl p-2 sm:p-3 text-center hover:bg-black/60 transition-colors"
                  >
                    <span className="text-lg sm:text-xl block mb-1">{member.icon}</span>
                    <p className="text-[#DEDBC8] text-[10px] sm:text-xs leading-tight">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

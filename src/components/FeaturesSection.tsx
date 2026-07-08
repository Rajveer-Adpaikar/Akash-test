import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle';

const headerSegments = [
  {
    text: 'Premium entertainment for extraordinary events.',
    className: 'text-primary',
  },
  {
    text: 'Bollywood hits. Live energy. Unforgettable nights.',
    className: 'text-white/50',
  },
];

interface FeatureCardProps {
  index: number;
  children: React.ReactNode;
}

function FeatureCard({ index, children }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="bg-[#212121] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <span className="text-gray-400 text-xs sm:text-sm">{text}</span>
    </li>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  useInView(headerRef, { once: true, margin: '-50px' });

  return (
    <section className="min-h-screen bg-black relative px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28" id="services">
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8 sm:mb-10 md:mb-12">
          <WordsPullUpMultiStyle
            segments={headerSegments}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
            delay={0.1}
          />
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:h-[480px] gap-3 sm:gap-2 md:gap-1">
          {/* Card 1 - Video */}
          <FeatureCard index={0}>
            <div className="relative flex-1 rounded-xl overflow-hidden min-h-[200px]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <p className="text-[#E1E0CC] text-xs sm:text-sm mt-3 font-display font-medium">
              The Akash Experience
            </p>
          </FeatureCard>

          {/* Card 2 - Live Performances */}
          <FeatureCard index={1}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">♪</span>
              </div>
              <div>
                <h3 className="text-primary text-sm sm:text-base font-display">
                  Live Performances.
                </h3>
                <span className="text-gray-500 text-xs">(01)</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 mt-3 flex-1">
              <CheckItem text="6-piece band: vocals, keys, bass, lead guitar, drums" />
              <CheckItem text="Female vocalist for duets and harmonies" />
              <CheckItem text="Bollywood hits, romantic covers, high-energy sets" />
              <CheckItem text="Professional FOH sound & production" />
            </ul>

            <a
              href="tel:+919923837062"
              className="group inline-flex items-center gap-1 text-primary text-xs mt-4 hover:underline"
            >
              Book now
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 -rotate-45" />
            </a>
          </FeatureCard>

          {/* Card 3 - Corporate Events */}
          <FeatureCard index={2}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">◆</span>
              </div>
              <div>
                <h3 className="text-primary text-sm sm:text-base font-display">
                  Corporate Events.
                </h3>
                <span className="text-gray-500 text-xs">(02)</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 mt-3 flex-1">
              <CheckItem text="High-profile booking: Birla White corporate event" />
              <CheckItem text="Elegant dinner sets to high-energy party anthems" />
              <CheckItem text="Tailored setlist matching your event theme" />
              <CheckItem text="Full production & logistics coordination" />
            </ul>

            <a
              href="tel:+919923837062"
              className="group inline-flex items-center gap-1 text-primary text-xs mt-4 hover:underline"
            >
              Book now
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 -rotate-45" />
            </a>
          </FeatureCard>

          {/* Card 4 - Destination Weddings */}
          <FeatureCard index={3}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">♥</span>
              </div>
              <div>
                <h3 className="text-primary text-sm sm:text-base font-display">
                  Destination Weddings.
                </h3>
                <span className="text-gray-500 text-xs">(03)</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 mt-3 flex-1">
              <CheckItem text="Goa-based, available for weddings across India" />
              <CheckItem text="Romantic Bollywood covers for every ceremony moment" />
              <CheckItem text="Sangeet, reception, and after-party sets" />
              <CheckItem text="Seamless coordination with your wedding planners" />
            </ul>

            <a
              href="tel:+919923837062"
              className="group inline-flex items-center gap-1 text-primary text-xs mt-4 hover:underline"
            >
              Book now
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 -rotate-45" />
            </a>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

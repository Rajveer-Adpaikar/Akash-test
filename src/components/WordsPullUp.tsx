import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  showAsterisk?: boolean;
}

export default function WordsPullUp({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  showAsterisk = false,
}: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block ${wordClassName}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{
            delay: delay + i * 0.08,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {i === words.length - 1 && showAsterisk && (
            <sup className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</sup>
          )}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </div>
  );
}

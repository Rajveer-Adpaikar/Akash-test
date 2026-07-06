# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Akash The Band** — a single-page portfolio website for Goa's premier Bollywood ensemble. Akash Mangeshkar fronts a 6-piece band specializing in destination weddings, corporate events, and live gigs. Dark cinematic design with a warm cream (#DEDBC8) palette.

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 3 with PostCSS
- **Animation:** Framer Motion 12 (pull-up words, scroll-linked opacity, card scale-ins)
- **Icons:** Lucide React (ArrowRight, Check, Phone, Mail, Music2)
- **Fonts:** Almarai (global default), Instrument Serif italic (accent headings)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npx tsc --noEmit` | Type-check without emitting |

## Project Structure

```
├── index.html               # Entry HTML with Google Fonts (Almarai + Instrument Serif)
├── src/
│   ├── main.tsx             # React root mount
│   ├── App.tsx              # Section composition
│   ├── index.css            # Tailwind directives + noise SVGs + global font reset
│   ├── components/
│   │   ├── HeroSection.tsx        # Fullscreen video hero with navbar, heading, CTA
│   │   ├── AboutSection.tsx       # Dark card with multi-style heading + scroll body text
│   │   ├── FeaturesSection.tsx    # 4-column card grid with staggered entrance
│   │   ├── FooterSection.tsx      # Contact links, phone, Instagram
│   │   ├── WordsPullUp.tsx        # Word-by-word slide-up animation (useInView)
│   │   ├── WordsPullUpMultiStyle.tsx  # Multi-segment word pull-up with per-segment classes
│   │   └── AnimatedLetter.tsx     # Scroll-linked character opacity (useScroll)
│   └── vite-env.d.ts        # Vite type declarations
├── tailwind.config.js       # Extends: colors.primary (#DEDBC8), fontFamily.serif
├── postcss.config.js
└── vite.config.ts
```

## Section Order

1. **HeroSection** — Full viewport video bg + noise overlay + gradient. Navbar pill (About, Services, Projects, Contact). Giant "Akash" heading → "Goa's premier Bollywood ensemble" description + "Book Now" CTA (calls +919923837062).
2. **AboutSection** — bg-[#101010] card. Label "Frontman — Akash The Band" → multi-style heading (normal + italic serif + normal) via WordsPullUpMultiStyle → scroll-driven paragraph reveal about Papon collab (738K views) and band lineup.
3. **FeaturesSection** — bg-noise overlay. Header text → 4-column card grid: (1) video card "The Akash Experience", (2) Live Performances with checklist, (3) Corporate Events, (4) Destination Weddings.
4. **FooterSection** — Instagram, phone (+91 99238 37062), email links.

## Key Content

- **Band lineup:** 6-piece (lead vocals, female vocals, keys, bass, lead guitar, drums) + FOH + production
- **Specialty:** Bollywood covers for luxury weddings and corporate events in Goa and across India
- **Hero content:** Papon collaboration at Goa concert — 738K views, 31K likes
- **High-profile booking:** Birla White corporate event
- **Contact:** +91 99238 37062

## Custom CSS Utilities

- `.noise-overlay` — SVG fractal noise (baseFrequency: 0.85, 3 octaves), mix-blend-overlay on hero video
- `.bg-noise` — SVG fractal noise (baseFrequency: 0.9, 4 octaves), subtle background on features section

## Animation Components

- **WordsPullUp** — Text split by spaces, each word animates y:20→0 with staggered 0.08s delay via useInView
- **WordsPullUpMultiStyle** — Takes segments [{text, className}], same pull-up effect with per-word class control
- **AnimatedLetter** — useScroll-based opacity for progressive paragraph reveal

## WAT Framework

This project also follows the WAT framework for any automated workflows:
- **Workflows** (`workflows/`) — Markdown SOPs for repeatable processes
- **Tools** (`tools/`) — Python scripts for deterministic execution
- **Subagents** (`.claude/agents/`) — Specialized agents for docs-fetching, debugging, QA, code review

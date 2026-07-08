const REELS = [
  '1208158883',
  '1208158917',
  '1208158916',
  '1208158881',
  '1208158886',
  '1208158884',
];

export default function ReelsSection() {
  return (
    <section className="bg-black px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 overflow-hidden" id="reels">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-primary text-xl sm:text-2xl md:text-3xl text-center mb-8 sm:mb-10">
          Event Reels
        </h2>

        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
        >
          {REELS.map((id, i) => (
            <div
              key={id}
              className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-start rounded-2xl overflow-hidden bg-[#101010]"
            >
              <div style={{ padding: '177.78% 0 0 0', position: 'relative' }}>
                <iframe
                  src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&background=1`}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                  title={`Reel ${i + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

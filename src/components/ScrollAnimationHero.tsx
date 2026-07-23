import React, { useEffect, useRef, useState, useCallback } from 'react';

const FRAME_COUNT = 240;
const pad = (n: number) => String(n).padStart(3, '0');
const frameUrl = (i: number) => `/Frames/ezgif-frame-${pad(i)}.webp`;

interface ScrollAnimationHeroProps {
  /** Called when user has scrolled past the animation section */
  onScrollComplete?: () => void;
}

export const ScrollAnimationHero: React.FC<ScrollAnimationHeroProps> = ({ onScrollComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0-1

  // ── Draw a frame — contain-fit with fallback to nearest loaded frame ──────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    let img = imagesRef.current[index];

    // Fallback: If target frame is still downloading, use nearest loaded frame
    if (!img || !img.complete) {
      for (let i = index - 1; i >= 0; i--) {
        if (imagesRef.current[i] && imagesRef.current[i].complete) {
          img = imagesRef.current[i];
          break;
        }
      }
    }

    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const ir = img.naturalWidth / img.naturalHeight || (1920 / 1080);
    const cr = cw / ch;

    // Guaranteed CONTAIN FIT: Full building, palm trees & roof 100% visible
    let dw: number, dh: number;
    if (cr < ir) {
      // Mobile / Portrait view: fit width so the entire house & palm trees fit inside screen width
      dw = cw * 0.94;
      dh = dw / ir;
    } else {
      // Desktop / Landscape view: fit height so full building fits comfortably
      dh = ch * 0.82;
      dw = dh * ir;
      if (dw > cw * 0.94) {
        dw = cw * 0.94;
        dh = dw / ir;
      }
    }

    const ox = (cw - dw) / 2;
    const oy = (ch - dh) / 2;

    // Fill canvas background with matching sky color
    ctx.fillStyle = '#a8cce8';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, dw, dh);
  }, []);

  // ── Resize canvas to container size ────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  // ── Smooth animation loop (lerp) ─────────────────────────────────────────
  const animLoop = useCallback(() => {
    const diff = targetFrameRef.current - currentFrameRef.current;
    if (Math.abs(diff) > 0.1) {
      currentFrameRef.current += diff * 0.12;
      drawFrame(Math.round(currentFrameRef.current));
    } else if (currentFrameRef.current !== targetFrameRef.current) {
      currentFrameRef.current = targetFrameRef.current;
      drawFrame(Math.round(currentFrameRef.current));
    }
    rafRef.current = requestAnimationFrame(animLoop);
  }, [drawFrame]);

  // ── Scroll handler — maps section scroll to frame index ─────────────────
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const scrolled = -rect.top;
      // scrollable range = section height minus the sticky canvas height
      const canvasH = window.innerHeight;
      const scrollable = sectionHeight - canvasH;
      const fraction = Math.max(0, Math.min(1, scrolled / scrollable));

      setScrollProgress(fraction);
      targetFrameRef.current = Math.min(FRAME_COUNT - 1, Math.floor(fraction * FRAME_COUNT));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Persistent Cache Storage Preloader — Reopening loads in 0ms ─────────
  useEffect(() => {
    let count = 0;
    let readyTriggered = false;
    const INITIAL_THRESHOLD = 10;
    const CACHE_NAME = 'arch-connect-frames-v1';
    const imgs: HTMLImageElement[] = [];

    async function loadFrameWithCache(index: number): Promise<HTMLImageElement> {
      const url = frameUrl(index);
      const img = new Image();

      try {
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(url);

          if (cachedResponse) {
            // ⚡ Loaded instantly from browser disk cache (0ms network)
            const blob = await cachedResponse.blob();
            img.src = URL.createObjectURL(blob);
            return new Promise((resolve) => {
              img.onload = img.onerror = () => resolve(img);
            });
          } else {
            // Fetch from network and save to persistent cache for future visits
            const networkResponse = await fetch(url);
            if (networkResponse.ok) {
              cache.put(url, networkResponse.clone());
              const blob = await networkResponse.blob();
              img.src = URL.createObjectURL(blob);
              return new Promise((resolve) => {
                img.onload = img.onerror = () => resolve(img);
              });
            }
          }
        }
      } catch {
        // Fallback for safety
      }

      img.src = url;
      return new Promise((resolve) => {
        img.onload = img.onerror = () => resolve(img);
      });
    }

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const placeholderImg = new Image();
      imgs.push(placeholderImg);

      loadFrameWithCache(i).then((loadedImg) => {
        imgs[i - 1] = loadedImg;
        count++;
        setLoadedCount(count);

        if (!readyTriggered && (count >= INITIAL_THRESHOLD || count === FRAME_COUNT)) {
          readyTriggered = true;
          setIsReady(true);
        }
      });
    }

    imagesRef.current = imgs;
  }, []);

  // ── Start render loop once ready ─────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    resizeCanvas();
    drawFrame(0);
    rafRef.current = requestAnimationFrame(animLoop);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isReady, resizeCanvas, animLoop, drawFrame]);

  const loadPercent = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    /**
     * Section is 300vh tall — canvas sticks at 560px height
     * so animation plays as user scrolls through.
     */
    <section
      ref={sectionRef}
      className="relative w-full max-w-full"
      style={{ height: '300vh' }}
    >
      {/* ── Sticky canvas container — fills viewport ──────── */}
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10"
        style={{ height: '100vh', position: 'sticky', top: 0 }}
      >

        {/* Loading overlay */}
        {!isReady && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
            style={{ background: '#0b0f0e' }}
          >
            {/* Spinner ring */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-[#4A3728]/30" />
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C4A882]"
                style={{ animation: 'spin 1s linear infinite' }}
              />
              {/* Percentage in center */}
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white font-display tabular-nums">
                {loadPercent}%
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C4A882]/80">
              Loading Experience
            </p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Dark contrast gradient overlays for high visibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(0, 40, 30, 0.45) 0%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 20, 15, 0.6) 100%), linear-gradient(to bottom, rgba(0, 30, 22, 0.5) 0%, transparent 40%, transparent 70%, rgba(0, 30, 22, 0.6) 100%)',
          }}
        />

        {/* ── Top Hero Copy — positioned ABOVE the home structure ─────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 sm:px-6 pt-3 sm:pt-6 lg:pt-8 pointer-events-none z-10"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3), transition: 'opacity 0.1s' }}
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#C4A882]/50 bg-[#4A3728]/80 backdrop-blur-md text-[#C4A882] text-xs font-bold uppercase tracking-[0.2em] shadow-xl mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C4A882] animate-pulse" />
            Architectural Craftsmanship
          </div>

          {/* Main Title */}
          <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-8xl text-white leading-[1.08] tracking-tight mb-2 drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)] px-2">
            Watch Your Vision<br />
            <span className="bg-gradient-to-r from-[#D4BC99] via-[#C4A882] to-[#ffffff] bg-clip-text text-transparent drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]">
              Come to Life
            </span>
          </h2>
        </div>

        {/* ── Bottom Hero Copy — positioned BELOW the home structure ─────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 sm:px-6 pb-6 sm:pb-10 pointer-events-none z-10"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3), transition: 'opacity 0.1s' }}
        >
          {/* Subtitle Card */}
          <p className="text-white font-medium text-xs sm:text-base lg:text-xl max-w-xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-[#4A3728]/40 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl sm:rounded-full border border-white/15 shadow-lg mb-4 mx-4">
            Scroll to experience our design-to-build process in motion.
          </p>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md">
              <span className="text-[#C4A882] text-[11px] font-bold uppercase tracking-widest">Scroll</span>
            </div>
            <svg width="22" height="30" viewBox="0 0 20 28" fill="none" className="text-white drop-shadow-md">
              <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="2"/>
              <rect x="9" y="6" width="2" height="6" rx="1" fill="#C4A882"/>
            </svg>
          </div>
        </div>



        {/* ── End-of-animation CTA — fades in at the bottom ────────────── */}
        <div
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 pointer-events-auto"
          style={{ opacity: Math.max(0, (scrollProgress - 0.85) * 7), transition: 'opacity 0.2s' }}
        >
          <div className="glass-panel rounded-2xl px-8 py-5 flex items-center gap-5 soft-shadow">
            <div>
              <p className="font-display font-bold text-base text-[#4A3728]">Ready to build?</p>
              <p className="text-xs text-slate-500 mt-0.5">Get matched with top professionals today.</p>
            </div>
            <button
              onClick={onScrollComplete}
              className="bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg transition-all whitespace-nowrap"
            >
              Get Started →
            </button>
          </div>
        </div>

      </div>

      {/* CSS keyframes for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GRID, WORDS } from "@/core/layout/englishClassic";
import { resolveActiveCells } from "@/core/layout/resolveActiveCells";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { ClockBoard } from "@/components/ClockBoard";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const PHOTOS = ["/photos/macbook.jpg", "/photos/desktop.jpg"];

function PhotoCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % PHOTOS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full">
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="WordSaver screensaver"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === active ? 0.85 : 0 }}
        />
      ))}
    </div>
  );
}

function LandingPage() {
  const words = useCurrentTime();
  const activeCells = resolveActiveCells(words, WORDS);

  return (
    <div
      className="min-h-svh bg-black flex flex-col items-center justify-center"
      style={{ padding: "3rem 1.5rem" }}
    >
      {/* Parent box: holds hero + footer with proper spacing */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* Hero: clock + carousel */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12">
          {/* Clock */}
          <div className="w-full lg:w-[40%] flex items-center justify-center px-4 lg:px-0">
            <ClockBoard grid={GRID} activeCells={activeCells} />
          </div>

          {/* Photo carousel — stretches to match clock height */}
          <div className="relative w-full lg:w-[60%] max-w-md lg:max-w-none lg:self-stretch overflow-hidden rounded-lg">
            <PhotoCarousel />
          </div>
        </div>

        {/* Footer: tagline + links */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ fontFamily: "'Geist Mono', monospace" }}
        >
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase">
            A word clock screensaver for macOS
          </p>

          <div className="flex items-center gap-6 text-[10px] tracking-[0.25em] uppercase">
            <a
              href="https://github.com/danielcspaiva/word-saver/releases/latest"
              className="text-zinc-400 hover:text-white transition-colors duration-500"
            >
              Download <span className="text-zinc-700">↓</span>
            </a>
            <span className="text-zinc-800">·</span>
            <a
              href="https://github.com/danielcspaiva/word-saver"
              className="text-zinc-600 hover:text-zinc-300 transition-colors duration-500"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

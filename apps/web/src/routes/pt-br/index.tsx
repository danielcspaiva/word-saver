import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GRID, WORDS } from "@/core/layout/portugueseBrazilian";
import { resolveActiveCells } from "@/core/layout/resolveActiveCells";
import { useCurrentTimePtBr } from "@/hooks/useCurrentTimePtBr";
import { ClockBoard } from "@/components/ClockBoard";

export const Route = createFileRoute("/pt-br/")({
  component: LandingPagePtBr,
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
          alt="Protetor de tela WordSaver"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === active ? 0.85 : 0 }}
        />
      ))}
    </div>
  );
}

function LandingPagePtBr() {
  const words = useCurrentTimePtBr();
  const activeCells = resolveActiveCells(words, WORDS);

  return (
    <div
      className="min-h-svh bg-black flex flex-col items-center justify-center"
      style={{ padding: "3rem 1.5rem" }}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:flex-wrap items-center lg:items-stretch gap-8 lg:gap-12">
        <div className="order-1 w-full lg:w-[40%] flex items-center justify-center px-4 lg:px-0">
          <ClockBoard grid={GRID} activeCells={activeCells} />
        </div>

        <div className="order-3 lg:order-2 relative w-full lg:flex-1 lg:min-w-0 max-w-md lg:max-w-none lg:self-stretch overflow-hidden rounded-lg">
          <PhotoCarousel />
        </div>

        <div
          className="order-2 lg:order-3 lg:basis-full flex flex-col lg:flex-row items-center lg:items-end lg:justify-between gap-6"
          style={{ fontFamily: "'Geist Mono', monospace" }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 text-[10px] tracking-[0.25em] uppercase">
            <p className="text-zinc-600 tracking-[0.4em]">
              Um relógio de palavras como protetor de tela para macOS
            </p>

            <span className="hidden lg:inline text-zinc-800">·</span>

            <div className="flex items-center gap-6">
              <Link
                to="/pt-br/download"
                className="text-zinc-400 hover:text-white transition-colors duration-500"
              >
                Baixar <span className="text-zinc-700">↓</span>
              </Link>
              <span className="text-zinc-800">·</span>
              <a
                href="https://github.com/danielcspaiva/word-saver"
                className="text-zinc-600 hover:text-zinc-300 transition-colors duration-500"
              >
                Código
              </a>
              <span className="text-zinc-800">·</span>
              <Link
                to="/"
                className="text-zinc-600 hover:text-zinc-300 transition-colors duration-500"
              >
                EN
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-zinc-700">
            <span>feito por</span>
            <a
              href="https://github.com/danielcspaiva"
              className="text-zinc-500 hover:text-zinc-300 transition-colors duration-500"
            >
              danielcspaiva
            </a>
            <span>·</span>
            <a
              href="https://dcsp.dev"
              className="text-zinc-500 hover:text-zinc-300 transition-colors duration-500"
            >
              blog
            </a>
          </div>
        </div>

        <div
          className="order-4 flex lg:hidden items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-zinc-700"
          style={{ fontFamily: "'Geist Mono', monospace" }}
        >
          <span>feito por</span>
          <a
            href="https://github.com/danielcspaiva"
            className="text-zinc-500 hover:text-zinc-300 transition-colors duration-500"
          >
            danielcspaiva
          </a>
          <span>·</span>
          <a
            href="https://dcsp.dev"
            className="text-zinc-500 hover:text-zinc-300 transition-colors duration-500"
          >
            blog
          </a>
        </div>
      </div>
    </div>
  );
}

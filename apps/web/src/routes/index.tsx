import { createFileRoute } from "@tanstack/react-router";
import { GRID, WORDS } from "@/core/layout/englishClassic";
import { resolveActiveCells } from "@/core/layout/resolveActiveCells";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { ClockCell } from "@/components/ClockCell";
import type { CellId } from "@/core/layout/types";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const words = useCurrentTime();
  const activeCells = resolveActiveCells(words, WORDS);

  return (
    <div className="min-h-svh bg-black flex flex-col items-center justify-center px-8 py-20">
      {/* Grid wrapper — sized to contain the visual overflow from letter tracking */}
      <div
        className="w-full mx-auto flex items-center justify-center"
        style={{ maxWidth: "min(70vw, 55vh)", padding: "0.8em", fontSize: "min(4vw, 3.4vh)" }}
      >
        <div
          className="grid grid-cols-11 aspect-square w-full font-mono leading-none tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "min(4vw, 3.4vh)",
          }}
        >
          {GRID.map((row, rowIdx) =>
            row
              .split("")
              .map((char, colIdx) => (
                <ClockCell
                  key={`${rowIdx}:${colIdx}`}
                  char={char}
                  active={activeCells.has(`${rowIdx}:${colIdx}` as CellId)}
                />
              )),
          )}
        </div>
      </div>

      <div
        className="mt-40 flex flex-col items-center gap-4"
        style={{ fontFamily: "'Geist Mono', monospace" }}
      >
        <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase">
          A word clock screensaver for macOS
        </p>

        <div className="flex items-center gap-6 text-[10px] tracking-[0.25em] uppercase">
          <a
            href="https://github.com/danielcspaiva/wordsaver/releases/latest"
            className="text-zinc-400 hover:text-white transition-colors duration-500"
          >
            Download <span className="text-zinc-700">↓</span>
          </a>
          <span className="text-zinc-800">·</span>
          <a
            href="https://github.com/danielcspaiva/wordsaver"
            className="text-zinc-600 hover:text-zinc-300 transition-colors duration-500"
          >
            Source
          </a>
        </div>
      </div>
    </div>
  );
}

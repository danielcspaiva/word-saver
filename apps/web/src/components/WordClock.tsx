import { GRID, WORDS } from "@/core/layout/englishClassic";
import { resolveActiveCells } from "@/core/layout/resolveActiveCells";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { ClockBoard } from "./ClockBoard";

export function WordClock() {
  const words = useCurrentTime();
  const activeCells = resolveActiveCells(words, WORDS);

  return (
    <div className="flex items-center justify-center min-h-svh bg-black p-8">
      <div className="w-full max-w-[min(80vw,80vh)]">
        <ClockBoard grid={GRID} activeCells={activeCells} />
      </div>
    </div>
  );
}

import type { CellId } from "@/core/layout/types";
import { ClockCell } from "./ClockCell";

interface ClockBoardProps {
  grid: readonly string[];
  activeCells: Set<CellId>;
}

export function ClockBoard({ grid, activeCells }: ClockBoardProps) {
  return (
    <div
      className="grid grid-cols-11 aspect-square w-full font-mono text-[min(4.5vw,4.5vh)] leading-none tracking-[0.3em] uppercase"
      style={{ fontFamily: "'Geist Mono', monospace" }}
    >
      {grid.map((row, rowIdx) =>
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
  );
}

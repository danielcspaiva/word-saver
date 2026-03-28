import type { CellId } from "@/core/layout/types";
import { ClockCell } from "./ClockCell";

interface ClockBoardProps {
  grid: readonly string[];
  activeCells: Set<CellId>;
}

export function ClockBoard({ grid, activeCells }: ClockBoardProps) {
  return (
    <div style={{ containerType: "inline-size" }} className="w-full">
      <div
        className="grid grid-cols-11 aspect-square w-full font-mono leading-none tracking-[0.3em] uppercase"
        style={{ fontFamily: "'Geist Mono', monospace", fontSize: "7cqi" }}
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
    </div>
  );
}

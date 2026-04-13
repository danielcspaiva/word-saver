import type { CellId, WordPlacement } from "./types";

export function resolveActiveCells<K extends string>(
  keys: readonly K[],
  words: Record<K, WordPlacement>,
): Set<CellId> {
  const cells = new Set<CellId>();

  for (const key of keys) {
    const placement = words[key];
    for (let col = placement.start; col <= placement.end; col++) {
      cells.add(`${placement.row}:${col}`);
    }
  }

  return cells;
}

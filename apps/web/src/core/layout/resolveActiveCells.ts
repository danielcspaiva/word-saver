import type { CellId, WordKey, WordPlacement } from "./types";

export function resolveActiveCells(
  keys: WordKey[],
  words: Record<WordKey, WordPlacement>,
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

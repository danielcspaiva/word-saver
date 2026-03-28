import { describe, expect, it } from "vitest";
import { resolveActiveCells } from "../core/layout/resolveActiveCells";
import { GRID, WORDS } from "../core/layout/englishClassic";
import type { WordKey } from "../core/layout/types";

describe("resolveActiveCells", () => {
  it("resolves IT IS SEVEN OCLOCK to correct cells", () => {
    const keys: WordKey[] = ["IT", "IS", "HOUR_SEVEN", "OCLOCK"];
    const cells = resolveActiveCells(keys, WORDS);

    // IT = row 0, cols 0-1 (2 chars)
    // IS = row 0, cols 3-4 (2 chars)
    // SEVEN = row 8, cols 0-4 (5 chars)
    // OCLOCK = row 9, cols 5-10 (6 chars)
    expect(cells.size).toBe(2 + 2 + 5 + 6);

    expect(cells.has("0:0")).toBe(true);
    expect(cells.has("0:1")).toBe(true);
    expect(cells.has("0:3")).toBe(true);
    expect(cells.has("0:4")).toBe(true);
    expect(cells.has("8:0")).toBe(true);
    expect(cells.has("8:4")).toBe(true);
    expect(cells.has("9:5")).toBe(true);
    expect(cells.has("9:10")).toBe(true);
  });

  it("produces no out-of-bounds cells", () => {
    const allKeys = Object.keys(WORDS) as WordKey[];
    const cells = resolveActiveCells(allKeys, WORDS);

    for (const cell of cells) {
      const [row, col] = cell.split(":").map(Number);
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(GRID.length);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(GRID[0]!.length);
    }
  });

  it("activated text matches grid characters", () => {
    const keys: WordKey[] = ["IT", "IS", "HALF", "PAST", "HOUR_SEVEN"];
    const cells = resolveActiveCells(keys, WORDS);

    const activeText = Array.from(cells)
      .sort()
      .map((cell) => {
        const [row, col] = cell.split(":").map(Number);
        return GRID[row]![col!];
      })
      .join("");

    expect(activeText).toContain("IT");
    expect(activeText).toContain("IS");
    expect(activeText).toContain("HALF");
    expect(activeText).toContain("PAST");
    expect(activeText).toContain("SEVEN");
  });
});

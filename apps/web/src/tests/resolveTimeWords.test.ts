import { describe, expect, it } from "vitest";
import { resolveTimeWords } from "../core/time/resolveTimeWords";
import type { WordKey } from "../core/layout/types";

function makeDate(hours: number, minutes: number): Date {
  const d = new Date(2026, 0, 1, hours, minutes, 0);
  return d;
}

describe("resolveTimeWords", () => {
  const cases: [string, number, number, WordKey[]][] = [
    ["7:00 — o'clock", 7, 0, ["IT", "IS", "HOUR_SEVEN", "OCLOCK"]],
    ["7:05 — five past", 7, 5, ["IT", "IS", "MINUTE_FIVE", "PAST", "HOUR_SEVEN"]],
    ["7:10 — ten past", 7, 10, ["IT", "IS", "MINUTE_TEN", "PAST", "HOUR_SEVEN"]],
    ["7:15 — quarter past", 7, 15, ["IT", "IS", "QUARTER", "PAST", "HOUR_SEVEN"]],
    ["7:20 — twenty past", 7, 20, ["IT", "IS", "TWENTY", "PAST", "HOUR_SEVEN"]],
    ["7:25 — twenty five past", 7, 25, ["IT", "IS", "TWENTY", "MINUTE_FIVE", "PAST", "HOUR_SEVEN"]],
    ["7:30 — half past", 7, 30, ["IT", "IS", "HALF", "PAST", "HOUR_SEVEN"]],
    ["7:35 — twenty five to", 7, 35, ["IT", "IS", "TWENTY", "MINUTE_FIVE", "TO", "HOUR_EIGHT"]],
    ["7:40 — twenty to", 7, 40, ["IT", "IS", "TWENTY", "TO", "HOUR_EIGHT"]],
    ["7:45 — quarter to", 7, 45, ["IT", "IS", "QUARTER", "TO", "HOUR_EIGHT"]],
    ["7:50 — ten to", 7, 50, ["IT", "IS", "MINUTE_TEN", "TO", "HOUR_EIGHT"]],
    ["7:55 — five to", 7, 55, ["IT", "IS", "MINUTE_FIVE", "TO", "HOUR_EIGHT"]],
  ];

  it.each(cases)("%s", (_label, hours, minutes, expected) => {
    expect(resolveTimeWords(makeDate(hours, minutes))).toEqual(expected);
  });

  describe("edge cases", () => {
    it("00:00 — twelve o'clock (midnight)", () => {
      expect(resolveTimeWords(makeDate(0, 0))).toEqual(["IT", "IS", "HOUR_TWELVE", "OCLOCK"]);
    });

    it("12:00 — twelve o'clock (noon)", () => {
      expect(resolveTimeWords(makeDate(12, 0))).toEqual(["IT", "IS", "HOUR_TWELVE", "OCLOCK"]);
    });

    it("12:35 — twenty five to one", () => {
      expect(resolveTimeWords(makeDate(12, 35))).toEqual([
        "IT",
        "IS",
        "TWENTY",
        "MINUTE_FIVE",
        "TO",
        "HOUR_ONE",
      ]);
    });

    it("23:55 — five to twelve", () => {
      expect(resolveTimeWords(makeDate(23, 55))).toEqual([
        "IT",
        "IS",
        "MINUTE_FIVE",
        "TO",
        "HOUR_TWELVE",
      ]);
    });

    it("floors to 5-minute bucket (7:08 → 7:05)", () => {
      expect(resolveTimeWords(makeDate(7, 8))).toEqual([
        "IT",
        "IS",
        "MINUTE_FIVE",
        "PAST",
        "HOUR_SEVEN",
      ]);
    });
  });
});

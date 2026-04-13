import { describe, expect, it } from "vitest";
import { resolveTimeWordsPtBr } from "../core/time/resolveTimeWordsPtBr";

function makeDate(hours: number, minutes: number) {
  return new Date(2026, 0, 1, hours, minutes, 0);
}

describe("resolveTimeWordsPtBr", () => {
  describe("exact hours (OCLOCK)", () => {
    it("7:00 — são sete horas", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 0))).toEqual(["IS_PLUR", "SETE", "HORAS"]);
    });

    it("1:00 — é uma hora", () => {
      expect(resolveTimeWordsPtBr(makeDate(1, 0))).toEqual(["IS_SING", "UMA", "HORA"]);
    });

    it("13:00 — é uma hora", () => {
      expect(resolveTimeWordsPtBr(makeDate(13, 0))).toEqual(["IS_SING", "UMA", "HORA"]);
    });

    it("12:00 — é meio-dia", () => {
      expect(resolveTimeWordsPtBr(makeDate(12, 0))).toEqual(["IS_SING", "MEIO", "DIA"]);
    });

    it("0:00 — é meia-noite", () => {
      expect(resolveTimeWordsPtBr(makeDate(0, 0))).toEqual(["IS_SING", "MEIA_NIGHT", "NOITE"]);
    });
  });

  describe("minutes past (PAST)", () => {
    it("7:05 — são sete e cinco", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 5))).toEqual([
        "IS_PLUR",
        "SETE",
        "E_CONN",
        "CINCO_MIN",
      ]);
    });

    it("7:10 — são sete e dez", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 10))).toEqual([
        "IS_PLUR",
        "SETE",
        "E_CONN",
        "DEZ_MIN",
      ]);
    });

    it("7:15 — são sete e um quarto", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 15))).toEqual([
        "IS_PLUR",
        "SETE",
        "E_CONN",
        "UM",
        "QUARTO",
      ]);
    });

    it("7:20 — são sete e vinte", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 20))).toEqual(["IS_PLUR", "SETE", "E_CONN", "VINTE"]);
    });

    it("7:25 — são sete e vinte e cinco", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 25))).toEqual([
        "IS_PLUR",
        "SETE",
        "E_CONN",
        "VINTE",
        "CINCO_MIN",
      ]);
    });

    it("7:30 — são sete e meia", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 30))).toEqual([
        "IS_PLUR",
        "SETE",
        "E_CONN",
        "MEIA_HALF",
      ]);
    });

    it("1:30 — é uma e meia", () => {
      expect(resolveTimeWordsPtBr(makeDate(1, 30))).toEqual([
        "IS_SING",
        "UMA",
        "E_CONN",
        "MEIA_HALF",
      ]);
    });

    it("12:30 — é meio-dia e meia", () => {
      expect(resolveTimeWordsPtBr(makeDate(12, 30))).toEqual([
        "IS_SING",
        "MEIO",
        "DIA",
        "E_CONN",
        "MEIA_HALF",
      ]);
    });
  });

  describe("subtractive form (MENOS)", () => {
    it("7:35 — são oito menos vinte e cinco", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 35))).toEqual([
        "IS_PLUR",
        "OITO",
        "MENOS",
        "VINTE",
        "CINCO_MIN",
      ]);
    });

    it("7:45 — são oito menos um quarto", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 45))).toEqual([
        "IS_PLUR",
        "OITO",
        "MENOS",
        "UM",
        "QUARTO",
      ]);
    });

    it("7:55 — são oito menos cinco", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 55))).toEqual([
        "IS_PLUR",
        "OITO",
        "MENOS",
        "CINCO_MIN",
      ]);
    });

    it("12:40 — é uma menos vinte (singular rollover to 1)", () => {
      expect(resolveTimeWordsPtBr(makeDate(12, 40))).toEqual(["IS_SING", "UMA", "MENOS", "VINTE"]);
    });

    it("11:50 — é meio-dia menos dez", () => {
      expect(resolveTimeWordsPtBr(makeDate(11, 50))).toEqual([
        "IS_SING",
        "MEIO",
        "DIA",
        "MENOS",
        "DEZ_MIN",
      ]);
    });

    it("23:50 — é meia-noite menos dez", () => {
      expect(resolveTimeWordsPtBr(makeDate(23, 50))).toEqual([
        "IS_SING",
        "MEIA_NIGHT",
        "NOITE",
        "MENOS",
        "DEZ_MIN",
      ]);
    });
  });

  describe("edge cases", () => {
    it("floors to 5-minute bucket (7:08 → 7:05)", () => {
      expect(resolveTimeWordsPtBr(makeDate(7, 8))).toEqual([
        "IS_PLUR",
        "SETE",
        "E_CONN",
        "CINCO_MIN",
      ]);
    });

    it("23:55 — é meia-noite menos cinco", () => {
      expect(resolveTimeWordsPtBr(makeDate(23, 55))).toEqual([
        "IS_SING",
        "MEIA_NIGHT",
        "NOITE",
        "MENOS",
        "CINCO_MIN",
      ]);
    });
  });
});

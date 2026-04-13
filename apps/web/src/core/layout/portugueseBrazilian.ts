import type { WordPlacement } from "./types";

export type WordKeyPtBr =
  | "IS_SING"
  | "IS_PLUR"
  | "UMA"
  | "DUAS"
  | "TRES"
  | "QUATRO"
  | "CINCO_HOUR"
  | "SEIS"
  | "SETE"
  | "OITO"
  | "NOVE"
  | "DEZ_HOUR"
  | "ONZE"
  | "MEIO"
  | "DIA"
  | "MEIA_NIGHT"
  | "NOITE"
  | "HORA"
  | "HORAS"
  | "E_CONN"
  | "MENOS"
  | "CINCO_MIN"
  | "DEZ_MIN"
  | "UM"
  | "QUARTO"
  | "VINTE"
  | "MEIA_HALF";

export const GRID = [
  "ÉSÃOUMATRÊS",
  "MEIOLDIADEZ",
  "DUASEISETEY",
  "QUATROHNOVE",
  "CINCOITONZE",
  "ZMEIALNOITE",
  "HORASYMENOS",
  "VINTECAMEIA",
  "UMVQUARTOPM",
  "DEZOEYCINCO",
] as const;

export const WORDS: Record<WordKeyPtBr, WordPlacement> = {
  IS_SING: { row: 0, start: 0, end: 0 },
  IS_PLUR: { row: 0, start: 1, end: 3 },
  UMA: { row: 0, start: 4, end: 6 },
  TRES: { row: 0, start: 7, end: 10 },
  MEIO: { row: 1, start: 0, end: 3 },
  DIA: { row: 1, start: 5, end: 7 },
  DEZ_MIN: { row: 1, start: 8, end: 10 },
  DUAS: { row: 2, start: 0, end: 3 },
  SEIS: { row: 2, start: 3, end: 6 },
  SETE: { row: 2, start: 6, end: 9 },
  QUATRO: { row: 3, start: 0, end: 5 },
  NOVE: { row: 3, start: 7, end: 10 },
  CINCO_HOUR: { row: 4, start: 0, end: 4 },
  OITO: { row: 4, start: 4, end: 7 },
  ONZE: { row: 4, start: 7, end: 10 },
  MEIA_NIGHT: { row: 5, start: 1, end: 4 },
  NOITE: { row: 5, start: 6, end: 10 },
  HORA: { row: 6, start: 0, end: 3 },
  HORAS: { row: 6, start: 0, end: 4 },
  E_CONN: { row: 6, start: 7, end: 7 },
  MENOS: { row: 6, start: 6, end: 10 },
  VINTE: { row: 7, start: 0, end: 4 },
  MEIA_HALF: { row: 7, start: 7, end: 10 },
  UM: { row: 8, start: 0, end: 1 },
  QUARTO: { row: 8, start: 3, end: 8 },
  DEZ_HOUR: { row: 9, start: 0, end: 2 },
  CINCO_MIN: { row: 9, start: 6, end: 10 },
};

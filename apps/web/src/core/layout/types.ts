export type WordKey =
  | "IT"
  | "IS"
  | "QUARTER"
  | "TWENTY"
  | "MINUTE_FIVE"
  | "HALF"
  | "MINUTE_TEN"
  | "TO"
  | "PAST"
  | "HOUR_ONE"
  | "HOUR_TWO"
  | "HOUR_THREE"
  | "HOUR_FOUR"
  | "HOUR_FIVE"
  | "HOUR_SIX"
  | "HOUR_SEVEN"
  | "HOUR_EIGHT"
  | "HOUR_NINE"
  | "HOUR_TEN"
  | "HOUR_ELEVEN"
  | "HOUR_TWELVE"
  | "OCLOCK";

export type WordPlacement = {
  row: number;
  start: number;
  end: number;
};

export type CellId = `${number}:${number}`;

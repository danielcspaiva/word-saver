import type { WordKey } from "../layout/types";

export type MinuteRule = {
  relation: "PAST" | "TO" | "OCLOCK";
  words: WordKey[];
};

export const MINUTE_RULES: Record<number, MinuteRule> = {
  0: { relation: "OCLOCK", words: [] },
  5: { relation: "PAST", words: ["MINUTE_FIVE"] },
  10: { relation: "PAST", words: ["MINUTE_TEN"] },
  15: { relation: "PAST", words: ["QUARTER"] },
  20: { relation: "PAST", words: ["TWENTY"] },
  25: { relation: "PAST", words: ["TWENTY", "MINUTE_FIVE"] },
  30: { relation: "PAST", words: ["HALF"] },
  35: { relation: "TO", words: ["TWENTY", "MINUTE_FIVE"] },
  40: { relation: "TO", words: ["TWENTY"] },
  45: { relation: "TO", words: ["QUARTER"] },
  50: { relation: "TO", words: ["MINUTE_TEN"] },
  55: { relation: "TO", words: ["MINUTE_FIVE"] },
};

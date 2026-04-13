import type { WordKeyPtBr } from "../layout/portugueseBrazilian";

type HourToken =
  | { kind: "special"; words: WordKeyPtBr[] }
  | { kind: "regular"; hourWord: WordKeyPtBr; singular: boolean };

function hourToken(hour24: number): HourToken {
  const h = ((hour24 % 24) + 24) % 24;
  if (h === 0) return { kind: "special", words: ["MEIA_NIGHT", "NOITE"] };
  if (h === 12) return { kind: "special", words: ["MEIO", "DIA"] };

  const h12 = h % 12;
  const regularHours: Record<number, WordKeyPtBr> = {
    1: "UMA",
    2: "DUAS",
    3: "TRES",
    4: "QUATRO",
    5: "CINCO_HOUR",
    6: "SEIS",
    7: "SETE",
    8: "OITO",
    9: "NOVE",
    10: "DEZ_HOUR",
    11: "ONZE",
  };
  return { kind: "regular", hourWord: regularHours[h12]!, singular: h12 === 1 };
}

type MinuteBucket = {
  relation: "PAST" | "TO" | "OCLOCK";
  minuteWords: WordKeyPtBr[];
};

const MINUTE_BUCKETS: Record<number, MinuteBucket> = {
  0: { relation: "OCLOCK", minuteWords: [] },
  5: { relation: "PAST", minuteWords: ["E_CONN", "CINCO_MIN"] },
  10: { relation: "PAST", minuteWords: ["E_CONN", "DEZ_MIN"] },
  15: { relation: "PAST", minuteWords: ["E_CONN", "UM", "QUARTO"] },
  20: { relation: "PAST", minuteWords: ["E_CONN", "VINTE"] },
  25: { relation: "PAST", minuteWords: ["E_CONN", "VINTE", "CINCO_MIN"] },
  30: { relation: "PAST", minuteWords: ["E_CONN", "MEIA_HALF"] },
  35: { relation: "TO", minuteWords: ["VINTE", "CINCO_MIN"] },
  40: { relation: "TO", minuteWords: ["VINTE"] },
  45: { relation: "TO", minuteWords: ["UM", "QUARTO"] },
  50: { relation: "TO", minuteWords: ["DEZ_MIN"] },
  55: { relation: "TO", minuteWords: ["CINCO_MIN"] },
};

function pushCopula(result: WordKeyPtBr[], singular: boolean) {
  result.push(singular ? "IS_SING" : "IS_PLUR");
}

function pushHour(result: WordKeyPtBr[], token: HourToken, attachHoras: boolean) {
  if (token.kind === "special") {
    result.push(...token.words);
    return;
  }
  result.push(token.hourWord);
  if (attachHoras) {
    result.push(token.singular ? "HORA" : "HORAS");
  }
}

export function resolveTimeWordsPtBr(date: Date): WordKeyPtBr[] {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const bucket = Math.floor(minutes / 5) * 5;
  const rule = MINUTE_BUCKETS[bucket]!;

  const displayHour24 = rule.relation === "TO" ? hours + 1 : hours;
  const token = hourToken(displayHour24);
  const singular = token.kind === "special" || token.singular;

  const result: WordKeyPtBr[] = [];

  if (rule.relation === "OCLOCK") {
    pushCopula(result, singular);
    pushHour(result, token, token.kind === "regular");
    return result;
  }

  if (rule.relation === "PAST") {
    pushCopula(result, singular);
    pushHour(result, token, false);
    result.push(...rule.minuteWords);
    return result;
  }

  pushCopula(result, singular);
  pushHour(result, token, false);
  result.push("MENOS", ...rule.minuteWords);
  return result;
}

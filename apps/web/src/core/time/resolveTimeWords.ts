import type { WordKey } from "../layout/types";
import { HOUR_WORDS } from "./hourWords";
import { MINUTE_RULES } from "./minuteRules";

function normalizeHour(hour: number): number {
  const h = ((hour % 12) + 12) % 12;
  return h === 0 ? 12 : h;
}

export function resolveTimeWords(date: Date): WordKey[] {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const bucket = Math.floor(minutes / 5) * 5;

  const rule = MINUTE_RULES[bucket]!;

  const displayHour = rule.relation === "TO" ? normalizeHour(hours + 1) : normalizeHour(hours);

  const result: WordKey[] = ["IT", "IS"];

  result.push(...rule.words);

  if (rule.relation !== "OCLOCK") {
    result.push(rule.relation);
  }

  result.push(HOUR_WORDS[displayHour]!);

  if (rule.relation === "OCLOCK") {
    result.push("OCLOCK");
  }

  return result;
}

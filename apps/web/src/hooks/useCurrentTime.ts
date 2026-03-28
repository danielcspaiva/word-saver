import { useEffect, useRef, useState } from "react";
import type { WordKey } from "@/core/layout/types";
import { resolveTimeWords } from "@/core/time/resolveTimeWords";

export function useCurrentTime(): WordKey[] {
  const [words, setWords] = useState<WordKey[]>(() => resolveTimeWords(new Date()));
  const prevRef = useRef<string>(JSON.stringify(words));

  useEffect(() => {
    const update = () => {
      const next = resolveTimeWords(new Date());
      const key = JSON.stringify(next);
      if (key !== prevRef.current) {
        prevRef.current = key;
        setWords(next);
      }
    };

    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);

  return words;
}

import { useEffect, useRef, useState } from "react";
import { resolveTimeWordsPtBr } from "@/core/time/resolveTimeWordsPtBr";

export function useCurrentTimePtBr() {
  const [words, setWords] = useState(() => resolveTimeWordsPtBr(new Date()));
  const prevRef = useRef(JSON.stringify(words));

  useEffect(() => {
    const update = () => {
      const next = resolveTimeWordsPtBr(new Date());
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

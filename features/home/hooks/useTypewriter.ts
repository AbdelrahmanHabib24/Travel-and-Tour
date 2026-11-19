"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through typing and backspacing the provided text at configurable speeds.
 */
export function useTypewriter(
  fullText: string,
  typingSpeed = 100,
  backspacingSpeed = 50,
): string {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let currentTimeout: ReturnType<typeof setTimeout>;

    const type = (i: number) => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        currentTimeout = setTimeout(() => type(i + 1), typingSpeed);
      } else {
        currentTimeout = setTimeout(() => backspace(fullText.length), 1000);
      }
    };

    const backspace = (i: number) => {
      if (i >= 0) {
        setTypedText(fullText.slice(0, i));
        currentTimeout = setTimeout(() => backspace(i - 1), backspacingSpeed);
      } else {
        currentTimeout = setTimeout(() => type(0), 500);
      }
    };

    type(0);
    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, [fullText, typingSpeed, backspacingSpeed]);

  return typedText;
}
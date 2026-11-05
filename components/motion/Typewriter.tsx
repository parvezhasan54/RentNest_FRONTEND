"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ words, className }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    const full = !deleting && text === word;
    const empty = deleting && text === "";

    const t = setTimeout(
      () => {
        if (full) setDeleting(true);
        else if (empty) { setDeleting(false); setI((n) => (n + 1) % words.length); }
        else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      },
      full ? 1400 : deleting ? 40 : 85
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle">&nbsp;</span>
    </span>
  );
}
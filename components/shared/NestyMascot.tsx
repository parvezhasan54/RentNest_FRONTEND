"use client";

import { motion } from "framer-motion";

const eye = { transformBox: "fill-box", transformOrigin: "center" } as const;
const blink = { scaleY: [1, 1, 0.1, 1] };
const blinkT = { duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.95, 1] };

export default function NestyMascot({ size = 48, thinking = false }: { size?: number; thinking?: boolean }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden className="text-primary"
      animate={thinking ? { y: [0, -3, 0], rotate: [0, -5, 5, 0] } : { y: [0, -5, 0] }}
      transition={{ duration: thinking ? 0.7 : 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M8 30 32 8l24 22v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V30Z" fill="currentColor" />
      <motion.ellipse cx="24" cy="36" rx="3.5" ry="4.5" fill="var(--primary-foreground)" style={eye} animate={blink} transition={blinkT} />
      <motion.ellipse cx="40" cy="36" rx="3.5" ry="4.5" fill="var(--primary-foreground)" style={eye} animate={blink} transition={blinkT} />
      <motion.path
        stroke="var(--primary-foreground)" strokeWidth="2.5" strokeLinecap="round" fill="none"
        initial={false}
        animate={{ d: thinking ? "M25 47q7 1 14 0" : "M25 46q7 7 14 0" }}
      />
    </motion.svg>
  );
}
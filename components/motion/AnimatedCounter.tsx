"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value, decimals = 0, suffix = "",
}: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.4, ease: "easeOut", onUpdate: setN });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}
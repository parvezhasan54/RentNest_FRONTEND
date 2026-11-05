"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      {children}
    </motion.div>
  );
}
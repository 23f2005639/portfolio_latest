"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent",
        "bg-[length:200%_auto] animate-gradient-x",
        className
      )}
    >
      {children}
    </motion.span>
  );
}

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  color?: string;
}

export function ProgressBar({ current, total, className, color = "#00E5FF" }: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, ((current + 1) / total) * 100));

  return (
    <div className={cn("w-full h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5", className)}>
      <motion.div
        className="h-full rounded-full shadow-[0_0_10px_currentColor]"
        style={{ backgroundColor: color, color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
}

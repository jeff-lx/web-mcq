import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  results?: (boolean | null)[]; // Array of results: true=correct, false=incorrect, null=unanswered
}

export function ProgressBar({ current, total, className, results = [] }: ProgressBarProps) {
  return (
    <div className={cn("w-full flex gap-1", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const result = results[index];
        let bgColor = "bg-slate-800/50";
        let borderColor = "border-white/5";
        let shadow = "";

        if (result === true) {
          bgColor = "bg-neon-green";
          borderColor = "border-neon-green";
          shadow = "shadow-[0_0_8px_rgba(34,255,136,0.6)]";
        } else if (result === false) {
          bgColor = "bg-neon-red";
          borderColor = "border-neon-red";
          shadow = "shadow-[0_0_8px_rgba(255,59,59,0.6)]";
        } else if (index === current) {
          bgColor = "bg-white/20";
          borderColor = "border-white/20";
        }

        return (
          <motion.div
            key={index}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "h-2 flex-1 rounded-full border transition-colors duration-300",
              bgColor,
              borderColor,
              shadow
            )}
          />
        );
      })}
    </div>
  );
}

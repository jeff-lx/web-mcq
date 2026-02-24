import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children?: ReactNode;
}

export function Button({ 
  className, 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-neon-blue text-white hover:bg-blue-600 shadow-[0_0_15px_rgba(27,107,255,0.5)] border border-blue-400/30",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-600",
    outline: "bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-bold uppercase tracking-wider",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-xl font-medium transition-colors relative overflow-hidden",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

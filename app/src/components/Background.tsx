import { motion, AnimatePresence, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import { GameConfig } from "@/lib/gameData";

interface BackgroundProps {
  image?: string;
  flashTrigger?: { type: 'correct' | 'incorrect', timestamp: number } | null;
  config?: GameConfig | null;
}

export function Background({ image, flashTrigger, config }: BackgroundProps) {
  const [neurons, setNeurons] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const neuronControls = useAnimation();

  // ... (useEffect for neurons generation)

  // Handle Flash Trigger
  useEffect(() => {
    if (flashTrigger) {
      const color = flashTrigger.type === 'correct' 
        ? (config?.correctColor || '#22FF88') 
        : (config?.incorrectColor || '#FF3B3B');
      
      // Flash Neurons
      neuronControls.start({
        backgroundColor: [null, color, config?.primaryColor || "#1B6BFF"], 
        scale: [null, 1.5, 1],
        transition: { duration: 0.5, ease: "easeOut" }
      });
    }
  }, [flashTrigger, neuronControls, config]);

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: config?.backgroundColor || "#020617" }}
    >
      {/* Base Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" 
        style={{ 
           // Optional: You could mix the primary color into the gradient if desired, 
           // but keeping it subtle is usually safer.
           // For now, let's respect the backgroundColor as the base.
        }}
      />

      {/* Flash Overlay */}
      <AnimatePresence>
        {flashTrigger && (
          <motion.div
            key={flashTrigger.timestamp}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 mix-blend-overlay z-10"
            style={{ 
              backgroundColor: flashTrigger.type === 'correct' 
                ? (config?.correctColor || '#22FF88') 
                : (config?.incorrectColor || '#FF3B3B') 
            }}
          />
        )}
      </AnimatePresence>

      {/* ... (Image) ... */}

      {/* Neuron Network Effect */}
      <div className="absolute inset-0 opacity-30">
        {neurons.map((neuron) => (
          <motion.div
            key={neuron.id}
            className="absolute w-1 h-1 rounded-full shadow-[0_0_10px_currentColor]"
            style={{ 
              left: `${neuron.x}%`, 
              top: `${neuron.y}%`,
              backgroundColor: config?.primaryColor || "#1B6BFF",
              color: config?.primaryColor || "#1B6BFF"
            }}
            animate={neuronControls}
            // Default animation (breathing)
            initial={{ opacity: 0, scale: 0, backgroundColor: config?.primaryColor || "#1B6BFF" }}
            whileInView={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                delay: neuron.delay,
                ease: "easeInOut",
              }
            }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {neurons.map((neuron, i) => {
            if (i >= neurons.length - 1) return null;
            const next = neurons[i + 1];
            if (Math.random() > 0.5) return null; 
            
            return (
              <motion.line
                key={`line-${i}`}
                x1={`${neuron.x}%`}
                y1={`${neuron.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke={config?.primaryColor || "#1B6BFF"}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: neuron.delay,
                  ease: "linear",
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Animated Orbs/Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px]"
        style={{ backgroundColor: `${config?.primaryColor || '#1B6BFF'}33` }} // 33 is ~20% opacity hex
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full blur-[80px]"
        style={{ backgroundColor: `${config?.accentColor || '#00E5FF'}1A` }} // 1A is ~10% opacity hex
      />

       <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
      />


      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

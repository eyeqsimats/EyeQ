import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

interface AnimatedBeamProps {
  className?: string;
  children: React.ReactNode;
}

const AnimatedBeam = ({ className, children }: AnimatedBeamProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [beams, setBeams] = useState<Array<{id: number, from: {x: number, y: number}, to: {x: number, y: number}}>>([]);

  // Generate random beams for demo
  React.useEffect(() => {
    const generateBeams = () => {
      const newBeams = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        from: { x: Math.random() * 100, y: Math.random() * 100 },
        to: { x: Math.random() * 100, y: Math.random() * 100 }
      }));
      setBeams(newBeams);
    };

    generateBeams();
    const interval = setInterval(generateBeams, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full", className)}
    >
      {children}
      
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          className="absolute h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{
            x: `${beam.from.x}%`,
            y: `${beam.from.y}%`,
            width: 0,
          }}
          animate={{
            x: `${beam.to.x}%`,
            y: `${beam.to.y}%`,
            width: "20%",
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export { AnimatedBeam };
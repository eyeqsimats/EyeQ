import React, { useRef } from "react";
import { motion } from "framer-motion";

interface StarBorderProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  color?: string;
  speed?: string;
  onClick?: () => void;
}

const StarBorder = ({
  children,
  as: Component = "div",
  className = "",
  color = "cyan",
  speed = "5s",
  onClick,
}: StarBorderProps) => {
  const borderRef = useRef<HTMLDivElement>(null);

  const colorMap: Record<string, string> = {
    cyan: "hsl(0, 0%, 70%)",
    blue: "hsl(0, 0%, 70%)",
    purple: "hsl(0, 0%, 70%)",
    pink: "hsl(0, 0%, 70%)",
  };

  const selectedColor = colorMap[color] || colorMap.cyan;

  return (
    <Component className={`relative ${className}`} onClick={onClick}>
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <motion.div
          ref={borderRef}
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg 340deg, ${selectedColor} 340deg 360deg)`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: parseFloat(speed),
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="absolute inset-[2px] bg-card rounded-lg" />
      </div>
      <div className="relative z-10">{children}</div>
    </Component>
  );
};

export default StarBorder;

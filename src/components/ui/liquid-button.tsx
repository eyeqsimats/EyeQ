"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LiquidButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "destructive" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  delay?: string;
  fillHeight?: string;
  hoverScale?: number;
  tapScale?: number;
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      delay = "0s",
      fillHeight = "3px",
      hoverScale = 1.05,
      tapScale = 0.95,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: tapScale }}
        style={{
          ...style,
          "--liquid-button-color": "currentColor",
          "--liquid-button-background-color": "transparent",
        } as React.CSSProperties}
        {...props}
      >
        <motion.span
          className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
          initial={{ y: "100%" }}
          whileHover={{
            y: fillHeight,
            transition: {
              duration: 0.6,
              ease: "easeInOut",
              delay: parseFloat(delay),
            },
          }}
        />
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";

export { LiquidButton };

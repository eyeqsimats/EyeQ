import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Transition } from "framer-motion";
import React, { ReactElement, useEffect, useState } from "react";

interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

const AnimatedList = ({ className, children, delay = 1000 }: AnimatedListProps) => {
  const [items, setItems] = useState<React.ReactNode[]>([]);
  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length < childrenArray.length) {
        setItems(prev => [...prev, childrenArray[prev.length]]);
      } else {
        setItems([]);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [childrenArray, delay, items.length]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <AnimatePresence>
        {items.map((item, index) => (
          <AnimatedListItem key={index}>
            {item}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedListItem = ({ children, className }: AnimatedListItemProps) => {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring" as const, stiffness: 350, damping: 40 } as Transition
  };

  return (
    <motion.div
      className={cn("mx-auto w-full", className)}
      {...animations}
    >
      {children}
    </motion.div>
  );
};

export { AnimatedList, AnimatedListItem };
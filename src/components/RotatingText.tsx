import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  mainClassName?: string;
  splitLevelClassName?: string;
  staggerFrom?: "first" | "last";
  initial?: any;
  animate?: any;
  exit?: any;
  staggerDuration?: number;
  transition?: any;
  rotationInterval?: number;
}

const RotatingText = ({
  texts,
  mainClassName = "",
  splitLevelClassName = "",
  staggerFrom = "last",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  staggerDuration = 0.025,
  transition = { type: "spring", damping: 30, stiffness: 400 },
  rotationInterval = 2000,
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[currentIndex];
  const letters = currentText.split("");

  return (
    <div className={mainClassName}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {letters.map((letter, i) => (
            <div key={i} className={splitLevelClassName}>
              <motion.span
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay:
                    staggerFrom === "last"
                      ? (letters.length - 1 - i) * staggerDuration
                      : i * staggerDuration,
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;

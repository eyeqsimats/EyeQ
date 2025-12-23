import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TextType from "./TextType";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Auto-complete after typing animation (approximately 3-4 seconds)
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-background flex items-center justify-center z-[9999]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <TextType
          text={["Welcome to EyeQ!!"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          loop={false}
          className="text-4xl md:text-6xl font-bold text-primary"
        />
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;

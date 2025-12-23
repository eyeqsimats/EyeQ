import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VideoSplashScreenProps {
  onVideoEnd: () => void;
}

const VideoSplashScreen = ({ onVideoEnd }: VideoSplashScreenProps) => {
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    // Set a timeout as fallback in case the video doesn't load or play
    const timer = setTimeout(() => {
      setIsEnding(true);
      // Add a small delay before calling onVideoEnd to allow blur animation
      setTimeout(() => {
        onVideoEnd();
      }, 300);
    }, 3000); // 3 seconds fallback

    return () => clearTimeout(timer);
  }, [onVideoEnd]);

  const handleVideoEnd = () => {
    setIsEnding(true);
    // Add a small delay before calling onVideoEnd to allow blur animation
    setTimeout(() => {
      onVideoEnd();
    }, 300);
  };

  return (
    <motion.div
      className={`fixed inset-0 bg-background flex items-center justify-center z-[9999] ${isEnding ? 'blur-sm' : ''}`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <video
        src="/eyeq vedio.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default VideoSplashScreen;
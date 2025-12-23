"use client";

import { useMotionValue } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export function GoogleGeminiEffectSection() {
  const pathLengthFirst = useMotionValue(0);
  const pathLengthSecond = useMotionValue(0);
  const pathLengthThird = useMotionValue(0);
  const pathLengthFourth = useMotionValue(0);
  const pathLengthFifth = useMotionValue(0);

  React.useEffect(() => {
    let frameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = (elapsed % 5) / 5;
      
      pathLengthFirst.set(Math.min(1.2, 0.2 + progress * 1.0));
      pathLengthSecond.set(Math.min(1.2, 0.15 + progress * 1.05));
      pathLengthThird.set(Math.min(1.2, 0.1 + progress * 1.1));
      pathLengthFourth.set(Math.min(1.2, 0.05 + progress * 1.15));
      pathLengthFifth.set(Math.min(1.2, progress * 1.2));
      
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative py-40 bg-black w-full dark:border dark:border-white/[0.1] rounded-md overflow-hidden min-h-screen flex items-center justify-center">
      {/* Gemini Animation Background Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
          Ready to Join the Vibe?
        </h2>
        <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl text-center">
          Be part of a community that's shaping the future of computer vision
        </p>
        
        <a
          href="https://chat.whatsapp.com/GxFFprWNX4d8mOQJOTz7d1"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all hover:scale-105 inline-block text-center"
        >
          Join Now
        </a>
      </div>
    </div>
  );
}

export default GoogleGeminiEffectSection;
import { useEffect, useRef, useState, ReactNode } from "react";

type AnimationType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "zoom";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: AnimationType;
  threshold?: number;
  once?: boolean;
}

const ScrollReveal = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 700, 
  animation = "slide-up", 
  threshold = 0.1,
  once = true
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold, once]);

  const getAnimationClasses = () => {
    if (!isVisible) {
      switch (animation) {
        case "fade":
          return "opacity-0";
        case "slide-up":
          return "opacity-0 translate-y-16";
        case "slide-down":
          return "opacity-0 -translate-y-16";
        case "slide-left":
          return "opacity-0 translate-x-16";
        case "slide-right":
          return "opacity-0 -translate-x-16";
        case "scale":
          return "opacity-0 scale-95";
        case "zoom":
          return "opacity-0 scale-110";
        default:
          return "opacity-0 translate-y-8";
      }
    }
    return "opacity-100 translate-y-0 translate-x-0 scale-100";
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${getAnimationClasses()} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;

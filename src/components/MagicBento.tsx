import { useState, useRef, useEffect } from "react";

interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  children?: React.ReactNode;
  className?: string;
}

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = "132, 0, 255",
  children,
  className = "",
}: MagicBentoProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);

  // Initialize particles
  useEffect(() => {
    if (enableStars) {
      const initialParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
      setParticles(initialParticles);
    }
  }, [enableStars, particleCount]);

  // Animate particles
  useEffect(() => {
    if (!enableStars) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [enableStars]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || (!enableMagnetism && !enableTilt)) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setMousePosition({ x, y });

    if (enableTilt) {
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((centerX - x) / centerX) * 10;
      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setMousePosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (clickEffect && cardRef.current) {
      cardRef.current.style.transform = "scale(0.98)";
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = "";
        }
      }, 150);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: enableTilt
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : undefined,
        transition: enableTilt ? "transform 0.1s ease-out" : undefined,
      }}
    >
      {/* Border Glow Effect */}
      {enableBorderGlow && isHovered && (
        <div
          className="absolute inset-0 rounded-2xl opacity-75"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, 0.3), transparent 70%)`,
            filter: `blur(20px)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Spotlight Effect */}
      {enableSpotlight && isHovered && (
        <div
          className="absolute opacity-30 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            width: spotlightRadius * 2,
            height: spotlightRadius * 2,
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)`,
            left: mousePosition.x - spotlightRadius,
            top: mousePosition.y - spotlightRadius,
            filter: "blur(40px)",
          }}
        />
      )}

      {/* Animated Particles/Stars */}
      {enableStars && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: isHovered ? 0.8 : 0.3,
                boxShadow: `0 0 10px rgba(${glowColor}, 0.5)`,
                transition: "opacity 0.3s",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Magnetism glow effect */}
      {enableMagnetism && isHovered && (
        <div
          className="absolute pointer-events-none rounded-2xl opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, 0.4), transparent 70%)`,
            filter: `blur(40px)`,
            inset: 0,
          }}
        />
      )}
    </div>
  );
};

export default MagicBento;

import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
}

const Marquee = ({ 
  children, 
  className, 
  pauseOnHover = false,
  reverse = false,
  fade = false,
  ...props 
}: MarqueeProps) => {
  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-max animate-marquee [--duration:40s] [--gap:1rem]",
          pauseOnHover && "group-hover:[--play-state:paused]",
          reverse && "[--direction:reverse]",
          fade && "[mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
        )}
      >
        {React.Children.map(children, (child, index) => (
          <div 
            key={index} 
            className="mx-2"
          >
            {child}
          </div>
        ))}
      </div>
      
      <div
        className={cn(
          "flex w-max animate-marquee [--duration:40s] [--gap:1rem]",
          pauseOnHover && "group-hover:[--play-state:paused]",
          reverse && "[--direction:reverse]",
          fade && "[mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
        )}
        aria-hidden="true"
      >
        {React.Children.map(children, (child, index) => (
          <div 
            key={`duplicate-${index}`} 
            className="mx-2"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Marquee };
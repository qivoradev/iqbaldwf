"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Responsive, low-latency lerp/spring so it never feels heavy or delayed
  const springX = useSpring(mouseX, { stiffness: 900, damping: 42, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 900, damping: 42, mass: 0.2 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    if (coarseQuery.matches) return;

    let initialized = false;

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!initialized) {
        initialized = true;
        setIsFinePointer(true);
      }
      setIsVisible(true);
    };

    const handleLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div
        className={`h-2 w-2 rounded-full bg-black transition-opacity duration-150 dark:bg-white ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </motion.div>
  );
}

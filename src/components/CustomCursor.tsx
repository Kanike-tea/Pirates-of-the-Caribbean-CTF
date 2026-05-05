"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Anchor } from "lucide-react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickRotation, setClickRotation] = useState(0);

  // Use motion values for better performance than state
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the trailing outer circle
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 });

  // Fast springs for the inner dot
  const dotSpringX = useSpring(mouseX, { stiffness: 700, damping: 28, mass: 0.1 });
  const dotSpringY = useSpring(mouseY, { stiffness: 700, damping: 28, mass: 0.1 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const tagName = target.tagName?.toLowerCase();
      
      // Text elements where we want the I-beam effect
      if (tagName === "input" || tagName === "textarea" || target.closest("input") || target.closest("textarea")) {
        setIsText(true);
        setIsHovering(false);
      } 
      // Clickable elements
      else if (
        tagName === "button" ||
        tagName === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
        setIsText(false);
      } 
      // Default
      else {
        setIsHovering(false);
        setIsText(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseDown = () => {
      setClickRotation((prev) => prev + 360);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer trailing circle */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 1.5 : isText ? 0.8 : 1,
          backgroundColor: isText ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)",
          borderWidth: isText ? "0px" : "1.5px",
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Inner dot / Anchor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] text-white mix-blend-difference"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isText ? 0 : isHovering ? 1.2 : 1, // Shrink to nothing when over text
          rotate: (isHovering ? -15 : 0) + clickRotation, // Slight tilt when hovering + spin on click
        }}
        transition={{ 
          scale: { duration: 0.15 },
          rotate: { type: "spring", stiffness: 150, damping: 12 }
        }}
      >
        <Anchor className="w-6 h-6" strokeWidth={2.5} />
      </motion.div>
    </>
  );
}

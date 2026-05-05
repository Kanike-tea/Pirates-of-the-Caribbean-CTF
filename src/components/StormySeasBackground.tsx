"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function StormySeasBackground() {
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerLightning = () => {
      setLightning(true);
      setTimeout(() => setLightning(false), 50);
      setTimeout(() => setLightning(true), 150);
      setTimeout(() => setLightning(false), 250);
      
      timeoutId = setTimeout(triggerLightning, Math.random() * 5000 + 3000);
    };

    timeoutId = setTimeout(triggerLightning, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const [drops] = React.useState(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      left: `${(i / 80) * 100}%`,
      top: `${Math.random() * -50}%`,
      height: `${Math.random() * 15 + 15}%`,
      duration: Math.random() * 0.3 + 0.3,
      delay: Math.random() * 2,
    }));
  });

  return (
    <div className="absolute inset-0 bg-transparent overflow-hidden pointer-events-none z-0 opacity-80 mix-blend-multiply">
      
      {/* Background Lighting / Flash */}
      <motion.div 
        className="absolute inset-0 bg-white z-0 mix-blend-overlay pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: lightning ? 0.25 : 0 }}
        transition={{ duration: 0.05 }}
      />

      {/* Epic Layered Clouds (Top) */}
      <motion.div 
        className="absolute top-[-5%] left-[-10%] w-[120%] h-[40%] bg-[#713f12] blur-3xl z-0 rounded-full opacity-30"
        animate={{ x: ["-2%", "2%", "-2%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[-10%] left-[-5%] w-[110%] h-[35%] bg-[#451a03] blur-2xl z-0 rounded-full opacity-40"
        animate={{ x: ["2%", "-2%", "2%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[10%] left-[20%] w-[60%] h-[20%] bg-[#713f12] blur-xl z-0 rounded-full opacity-20"
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Lightning Bolts */}
      <motion.svg 
        className="absolute top-0 right-[20%] w-32 h-64 z-0 text-amber-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: lightning ? 0.9 : 0 }}
        transition={{ duration: 0.05 }}
        viewBox="0 0 100 200"
      >
        <path d="M 50 0 L 25 70 L 45 70 L 15 170 L 70 80 L 40 80 Z" fill="currentColor" filter="drop-shadow(0 0 12px rgba(255,255,255,1))" />
      </motion.svg>

      <motion.svg 
        className="absolute top-[10%] left-[30%] w-20 h-48 z-0 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: lightning ? 0.8 : 0 }}
        transition={{ duration: 0.05, delay: 0.05 }}
        viewBox="0 0 100 200"
      >
        <path d="M 60 0 L 35 65 L 50 65 L 20 150 L 75 75 L 50 75 Z" fill="currentColor" filter="drop-shadow(0 0 10px rgba(160,240,255,0.9))" />
      </motion.svg>

      <motion.svg 
        className="absolute top-[-5%] left-[70%] w-40 h-80 z-0 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: lightning ? 0.5 : 0 }}
        transition={{ duration: 0.05, delay: 0.1 }}
        viewBox="0 0 100 200"
      >
        <path d="M 40 0 L 10 90 L 35 90 L 0 200 L 60 100 L 30 100 Z" fill="currentColor" filter="drop-shadow(0 0 15px rgba(255,255,255,0.7))" />
      </motion.svg>

      {/* Heavy Rain - slanted */}
      <div className="absolute inset-[-20%] z-0 overflow-hidden transform rotate-[15deg] pointer-events-none">
        {drops.map((drop, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-b from-transparent via-[#713f12]/20 to-[#451a03]/30 w-[1px]"
            style={{
              left: drop.left,
              top: drop.top,
              height: drop.height,
            }}
            animate={{ y: ["0vh", "150vh"] }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              ease: "linear",
              delay: drop.delay
            }}
          />
        ))}
      </div>

      {/* Sea Background Glow */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-48 bg-[#451a03]/20 blur-3xl z-0"
        animate={{ opacity: lightning ? 0.6 : 0.2 }}
      />

      {/* Crashing Sea Waves Container */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] z-0 flex items-end overflow-hidden pointer-events-none">
        
        {/* Layer 1 (Back Dark Waves) */}
        <motion.div 
          className="absolute w-[200%] bottom-[20%] text-[#713f12] opacity-40"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className="w-full h-24">
            <path d="M0,40 C150,100 450,0 600,40 C750,100 1050,0 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
            <path d="M1200,40 C1350,100 1650,0 1800,40 C1950,100 2250,0 2400,40 L2400,120 L1200,120 Z" fill="currentColor"></path>
          </svg>
        </motion.div>

        {/* Layer 2 (Mid Ocean Waves) */}
        <motion.div 
          className="absolute w-[200%] bottom-[10%] text-[#854d0e] opacity-40"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className="w-full h-32">
            <path d="M0,60 C200,20 400,110 600,60 C800,10 1000,110 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
            <path d="M1200,60 C1400,20 1600,110 1800,60 C2000,10 2200,110 2400,60 L2400,120 L1200,120 Z" fill="currentColor"></path>
          </svg>
        </motion.div>

        {/* Layer 3 (Front Aggressive Waves with Whitecaps) */}
        <motion.div 
          className="absolute w-[200%] bottom-[-5%] text-[#451a03] opacity-60"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className="w-full h-40">
             {/* Foam / Whitecaps */}
             <path d="M0,80 C250,-10 350,130 600,80 C850,30 950,130 1200,80 L1200,120 L0,120 Z" fill="rgba(245,230,200,0.5)" transform="translate(-8, -8)"></path>
             <path d="M1200,80 C1450,-10 1550,130 1800,80 C2050,30 2150,130 2400,80 L2400,120 L1200,120 Z" fill="rgba(245,230,200,0.5)" transform="translate(-8, -8)"></path>
             
             {/* Main wave body */}
             <path d="M0,80 C250,-10 350,130 600,80 C850,30 950,130 1200,80 L1200,120 L0,120 Z" fill="currentColor"></path>
             <path d="M1200,80 C1450,-10 1550,130 1800,80 C2050,30 2150,130 2400,80 L2400,120 L1200,120 Z" fill="currentColor"></path>
          </svg>
        </motion.div>
      </div>

    </div>
  );
}

"use client";

import React from "react";

interface VintageCompassProps extends React.SVGProps<SVGSVGElement> {}

export default function VintageCompass(props: VintageCompassProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer rings */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
      
      {/* Center circle */}
      <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.1" />
      <circle cx="50" cy="50" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />

      {/* Main 4 Points (N, S, E, W) */}
      <path d="M50 8 L55 45 L50 50 Z" fill="currentColor" opacity="0.8" />
      <path d="M50 8 L45 45 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      
      <path d="M50 92 L55 55 L50 50 Z" fill="currentColor" opacity="0.8" />
      <path d="M50 92 L45 55 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      
      <path d="M92 50 L55 55 L50 50 Z" fill="currentColor" opacity="0.8" />
      <path d="M92 50 L55 45 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      
      <path d="M8 50 L45 55 L50 50 Z" fill="currentColor" opacity="0.8" />
      <path d="M8 50 L45 45 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />

      {/* Secondary 4 Points (NE, NW, SE, SW) */}
      <path d="M78 22 L55 45 L50 50 Z" fill="currentColor" opacity="0.4" />
      <path d="M78 22 L62 38 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />

      <path d="M22 78 L45 55 L50 50 Z" fill="currentColor" opacity="0.4" />
      <path d="M22 78 L38 62 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />

      <path d="M78 78 L55 55 L50 50 Z" fill="currentColor" opacity="0.4" />
      <path d="M78 78 L62 62 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />

      <path d="M22 22 L45 45 L50 50 Z" fill="currentColor" opacity="0.4" />
      <path d="M22 22 L38 38 L50 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />

      {/* Degree ticks */}
      <g stroke="currentColor" strokeWidth="0.5">
        <line x1="50" y1="2" x2="50" y2="5" />
        <line x1="50" y1="95" x2="50" y2="98" />
        <line x1="2" y1="50" x2="5" y2="50" />
        <line x1="95" y1="50" x2="98" y2="50" />
        
        {/* Additional 45deg ticks */}
        <line x1="16" y1="16" x2="18.5" y2="18.5" />
        <line x1="84" y1="16" x2="81.5" y2="18.5" />
        <line x1="16" y1="84" x2="18.5" y2="81.5" />
        <line x1="84" y1="84" x2="81.5" y2="81.5" />
      </g>
      
      {/* Decorative text positions / symbols */}
      <text x="50" y="15" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor" opacity="0.9" style={{ fontFamily: "serif" }}>N</text>
      <text x="50" y="89" fontSize="5" fontWeight="bold" textAnchor="middle" fill="currentColor" opacity="0.7" style={{ fontFamily: "serif" }}>S</text>
      <text x="89" y="52" fontSize="5" fontWeight="bold" textAnchor="middle" fill="currentColor" opacity="0.7" style={{ fontFamily: "serif" }}>E</text>
      <text x="11" y="52" fontSize="5" fontWeight="bold" textAnchor="middle" fill="currentColor" opacity="0.7" style={{ fontFamily: "serif" }}>W</text>
      
      {/* Astrolabe details */}
      <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="0.25" />
      <path d="M36 36 L64 64" stroke="currentColor" strokeWidth="0.25" opacity="0.5" />
      <path d="M36 64 L64 36" stroke="currentColor" strokeWidth="0.25" opacity="0.5" />
    </svg>
  );
}

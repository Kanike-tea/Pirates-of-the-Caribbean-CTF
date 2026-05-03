import React from 'react';

export default function PirateShip({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
      {/* Back Sail */}
      <path d="M 65 30 Q 80 50 65 65 Q 60 50 65 30" fill="currentColor" stroke="#000" strokeWidth="2" opacity="0.6"/>
      {/* Front Sail */}
      <path d="M 40 20 Q 20 45 40 65 Q 45 45 40 20" fill="currentColor" stroke="#000" strokeWidth="2" opacity="0.8"/>
      {/* Main Sail */}
      <path d="M 50 10 Q 25 40 50 70 Q 55 40 50 10" fill="currentColor" stroke="#000" strokeWidth="2"/>
      
      {/* Skull on Main Sail */}
      <circle cx="43" cy="40" r="4" fill="#fff" />
      <circle cx="41" cy="39" r="1" fill="#000" />
      <circle cx="45" cy="39" r="1" fill="#000" />
      <path d="M 41 45 L 45 45 M 40 46 L 46 46" stroke="#fff" strokeWidth="1"/>

      {/* Masts */}
      <rect x="48" y="10" width="3" height="65" fill="#4a3018" />
      <rect x="38" y="20" width="2" height="50" fill="#4a3018" />
      <rect x="63" y="30" width="2" height="40" fill="#4a3018" />

      {/* Hull */}
      <path d="M 15 70 L 85 70 L 75 90 L 25 90 Z" fill="#5c3a21" stroke="#2e1d10" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M 10 70 Q 15 65 20 70" fill="none" stroke="#5c3a21" strokeWidth="3"/>
      
      {/* Cannons */}
      <circle cx="35" cy="80" r="2" fill="#000" />
      <circle cx="50" cy="80" r="2" fill="#000" />
      <circle cx="65" cy="80" r="2" fill="#000" />
      
      {/* Flag */}
      <path d="M 48 10 L 35 15 L 48 20 Z" fill="#800000" />
    </svg>
  );
}

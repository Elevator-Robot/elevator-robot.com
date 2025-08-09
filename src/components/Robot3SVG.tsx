import React from 'react';

interface Robot3SVGProps {
  className?: string;
  width?: number;
  height?: number;
}

const Robot3SVG: React.FC<Robot3SVGProps> = ({ 
  className = "", 
  width = 300, 
  height = 220 
}) => {
  return (
    <svg 
      id="bot3SVG" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 220" 
      role="img" 
      aria-labelledby="bot3Title bot3Desc"
      width={width}
      height={height}
      className={`cursor-pointer ${className}`}
    >
      <title id="bot3Title">Round Chubby Robot</title>
      <desc id="bot3Desc">Chubby robot that jiggles when clicked!</desc>

      <defs>
        <filter id="softShadow3" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/>
        </filter>
        <style>
          {`
            .stroke3 { stroke: #334155; }
            .body3 { fill: #dcfce7; }
            .accent3 { fill: #22c55e; }
            .eyeWhite3 { fill: #ffffff; stroke: #1f2937; }
            .pupil3 { fill: #1f2937; }
          `}
        </style>
      </defs>

      {/* Background circle */}
      <circle cx="150" cy="110" r="92" fill="#22c55e" opacity="0.15"/>

      {/* Main body group that jiggles */}
      <g id="jigglingBody">
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1 1;1.1 0.9;0.9 1.1;1.05 0.95;0.95 1.05;1 1"
          dur="0.8s"
          begin="bot3SVG.click"
          transformOrigin="150 130"
        />
        
        {/* Two short antennas */}
        <g className="stroke3" strokeWidth="3" strokeLinecap="round" filter="url(#softShadow3)">
          <line x1="130" y1="70" x2="125" y2="55"/>
          <circle cx="125" cy="55" r="5" className="accent3" stroke="#334155"/>
          <line x1="170" y1="70" x2="175" y2="55"/>
          <circle cx="175" cy="55" r="5" className="accent3" stroke="#334155"/>
        </g>

        {/* Round chubby head */}
        <g id="head3" filter="url(#softShadow3)">
          <circle cx="150" cy="90" r="40" className="body3" stroke="#334155" strokeWidth="3"/>
        </g>

        {/* Big round eyes */}
        <g id="eyes3">
          <circle cx="135" cy="85" r="12" className="eyeWhite3" strokeWidth="3"/>
          <circle cx="165" cy="85" r="12" className="eyeWhite3" strokeWidth="3"/>
          
          {/* Happy pupils */}
          <circle cx="135" cy="85" r="5" className="pupil3">
            <animate attributeName="r" values="5;8;5" dur="0.8s" begin="bot3SVG.click"/>
          </circle>
          <circle cx="165" cy="85" r="5" className="pupil3">
            <animate attributeName="r" values="5;8;5" dur="0.8s" begin="bot3SVG.click"/>
          </circle>
          
          {/* Sparkles */}
          <circle cx="140" cy="80" r="1" fill="#22c55e" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="0.8s" begin="bot3SVG.click"/>
          </circle>
          <circle cx="160" cy="80" r="1" fill="#22c55e" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="0.8s" begin="bot3SVG.click"/>
          </circle>
        </g>

        {/* Big happy smile */}
        <path d="M125 100 Q150 120 175 100" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

        {/* Chubby round body */}
        <ellipse cx="150" cy="150" rx="50" ry="40" className="body3" stroke="#334155" strokeWidth="3" filter="url(#softShadow3)"/>
        
        {/* Belly button */}
        <circle cx="150" cy="150" r="3" className="accent3"/>
        
        {/* Arms */}
        <ellipse cx="100" cy="140" rx="15" ry="25" className="body3" stroke="#334155" strokeWidth="3"/>
        <ellipse cx="200" cy="140" rx="15" ry="25" className="body3" stroke="#334155" strokeWidth="3"/>
      </g>
    </svg>
  );
};

export default Robot3SVG;

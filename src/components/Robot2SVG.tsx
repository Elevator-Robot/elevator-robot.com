import React from 'react';

interface Robot2SVGProps {
  className?: string;
  width?: number;
  height?: number;
}

const Robot2SVG: React.FC<Robot2SVGProps> = ({ 
  className = "", 
  width = 300, 
  height = 220 
}) => {
  return (
    <svg 
      id="bot2SVG" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 220" 
      role="img" 
      aria-labelledby="bot2Title bot2Desc"
      width={width}
      height={height}
      className={`cursor-pointer ${className}`}
    >
      <title id="bot2Title">Tall Skinny Robot</title>
      <desc id="bot2Desc">Tall skinny robot that wobbles when clicked!</desc>

      <defs>
        <filter id="softShadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/>
        </filter>
        <style>
          {`
            .stroke2 { stroke: #334155; }
            .body2 { fill: #fef3c7; }
            .accent2 { fill: #f59e0b; }
            .eyeWhite2 { fill: #ffffff; stroke: #1f2937; }
            .pupil2 { fill: #1f2937; }
          `}
        </style>
      </defs>

      {/* Background circle */}
      <circle cx="150" cy="110" r="92" fill="#f59e0b" opacity="0.15"/>

      {/* Main body group that wobbles */}
      <g id="wobblingBody">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 150 110;-5 150 110;5 150 110;-3 150 110;3 150 110;0 150 110"
          dur="1.2s"
          begin="bot2SVG.click"
        />
        
        {/* Single tall antenna */}
        <g className="stroke2" strokeWidth="3" strokeLinecap="round" filter="url(#softShadow2)">
          <line x1="150" y1="40" x2="150" y2="15"/>
          <circle cx="150" cy="15" r="8" className="accent2" stroke="#334155"/>
        </g>

        {/* Tall rectangular head */}
        <g id="head2" filter="url(#softShadow2)">
          <rect x="120" y="40" width="60" height="80" rx="12" className="body2" stroke="#334155" strokeWidth="3"/>
          <line x1="125" y1="50" x2="175" y2="50" stroke="#334155" strokeWidth="2" opacity="0.35"/>
        </g>

        {/* Eyes - rectangular robot eyes */}
        <g id="eyes2">
          <rect x="130" y="65" width="12" height="8" rx="2" className="eyeWhite2" strokeWidth="2"/>
          <rect x="158" y="65" width="12" height="8" rx="2" className="eyeWhite2" strokeWidth="2"/>
          
          {/* LED-style pupils */}
          <rect x="132" y="67" width="8" height="4" rx="1" className="accent2">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" begin="bot2SVG.click"/>
          </rect>
          <rect x="160" y="67" width="8" height="4" rx="1" className="accent2">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" begin="bot2SVG.click"/>
          </rect>
        </g>

        {/* Digital smile */}
        <rect x="135" y="90" width="30" height="4" rx="2" className="accent2"/>

        {/* Long skinny neck */}
        <rect x="145" y="120" width="10" height="20" rx="2" className="body2" stroke="#334155" strokeWidth="3"/>
        
        {/* Tall rectangular torso */}
        <rect x="125" y="140" width="50" height="60" rx="8" className="body2" stroke="#334155" strokeWidth="3"/>
        
        {/* Control panel */}
        <circle cx="140" cy="160" r="4" className="accent2"/>
        <circle cx="160" cy="160" r="4" className="accent2"/>
        <rect x="135" y="175" width="30" height="3" rx="1" className="accent2"/>
      </g>
    </svg>
  );
};

export default Robot2SVG;

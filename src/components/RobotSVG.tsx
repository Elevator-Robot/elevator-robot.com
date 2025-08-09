import React from 'react';

interface RobotSVGProps {
  className?: string;
  width?: number;
  height?: number;
}

const RobotSVG: React.FC<RobotSVGProps> = ({ 
  className = "", 
  width = 300, 
  height = 220 
}) => {
  return (
    <svg 
      id="botSVG" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 220" 
      role="img" 
      aria-labelledby="botTitle botDesc"
      width={width}
      height={height}
      className={`cursor-pointer ${className}`}
    >
      <title id="botTitle">Robot</title>
      <desc id="botDesc">Friendly robot icon with click-to-blink eyes. Designed to work as a standalone SVG image.</desc>

      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/>
        </filter>
        <style>
          {`
            .stroke { stroke: #334155; }
            .body { fill: #e8eef7; }
            .accent { fill: #7aa2ff; }
            .eyeWhite { fill: #ffffff; stroke: #1f2937; }
            .pupil { fill: #1f2937; }
          `}
        </style>
      </defs>

      {/* Background circle (subtle, like the reference) */}
      <circle cx="150" cy="110" r="92" fill="#67b7f7" opacity="0.18"/>

      {/* Antennas */}
      <g className="stroke" strokeWidth="3" strokeLinecap="round" filter="url(#softShadow)">
        <line x1="118" y1="58" x2="98" y2="35"/>
        <circle cx="98" cy="35" r="6" className="accent" stroke="#334155"/>
        <line x1="182" y1="58" x2="202" y2="32"/>
        <circle cx="202" cy="32" r="6" className="accent" stroke="#334155"/>
      </g>

      {/* Ears */}
      <g filter="url(#softShadow)">
        <rect x="78" y="85" width="16" height="34" rx="6" className="body" stroke="#334155" strokeWidth="3"/>
        <rect x="206" y="85" width="16" height="34" rx="6" className="body" stroke="#334155" strokeWidth="3"/>
      </g>

      {/* Head */}
      <g id="head" filter="url(#softShadow)">
        <rect x="90" y="60" width="120" height="90" rx="18" className="body" stroke="#334155" strokeWidth="3"/>
        <line x1="96" y1="76" x2="204" y2="76" stroke="#334155" strokeWidth="2" opacity="0.35"/>
      </g>

      {/* Eyes */}
      <g id="eyes">
        <g id="leftEye">
          <circle cx="130" cy="98" r="16" className="eyeWhite" strokeWidth="3"/>
          <circle id="pupilLeft" cx="130" cy="98" r="6" className="pupil">
            <animate attributeName="opacity" values="1;0;1" dur="0.22s" begin="botSVG.click"/>
          </circle>
          {/* eyelid covering eye on click */}
          <rect x="114" y="82" width="32" height="0" fill="#e8eef7">
            <animate attributeName="height" values="0;32;0" keyTimes="0;0.5;1" dur="0.22s" begin="botSVG.click" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"/>
          </rect>
        </g>
        <g id="rightEye">
          <circle cx="170" cy="98" r="16" className="eyeWhite" strokeWidth="3"/>
          <circle id="pupilRight" cx="170" cy="98" r="6" className="pupil">
            <animate attributeName="opacity" values="1;0;1" dur="0.22s" begin="botSVG.click"/>
          </circle>
          <rect x="154" y="82" width="32" height="0" fill="#e8eef7">
            <animate attributeName="height" values="0;32;0" keyTimes="0;0.5;1" dur="0.22s" begin="botSVG.click" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"/>
          </rect>
        </g>
        <circle cx="133" cy="95" r="2" fill="#ffffff" opacity="0.85"/>
        <circle cx="173" cy="95" r="2" fill="#ffffff" opacity="0.85"/>
      </g>

      {/* Smile */}
      <path d="M128 118 Q150 132 172 118" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

      {/* Neck and torso base (simple, non-grass) */}
      <rect x="140" y="150" width="20" height="10" rx="3" className="body" stroke="#334155" strokeWidth="3"/>
      <rect x="90" y="160" width="120" height="40" rx="16" className="body" stroke="#334155" strokeWidth="3"/>
    </svg>
  );
};

export default RobotSVG;

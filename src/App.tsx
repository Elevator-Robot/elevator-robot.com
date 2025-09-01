import { useState, FormEvent, useEffect } from "react";
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import { SendMessageMutation } from './graphql/API';

// Robot Decoration Component
interface RobotDecorationProps {
  type: 'blinking' | 'shocked' | 'bouncy' | 'squid';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const RobotDecoration: React.FC<RobotDecorationProps> = ({ type, position }) => {
  const getRobotSVG = () => {
    switch (type) {
      case 'blinking':
        return (
          <svg 
            id="friendlyRobotSVG" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 220" 
            role="img" 
            aria-labelledby="friendlyRobotTitle friendlyRobotDesc"
            className="robot-svg"
            onClick={() => {
              const svg = document.getElementById('friendlyRobotSVG');
              if (svg) {
                const animations = svg.querySelectorAll('animate');
                animations.forEach(anim => {
                  (anim as any).beginElement();
                });
              }
            }}
          >
            <title id="friendlyRobotTitle">Friendly Robot</title>
            <desc id="friendlyRobotDesc">Friendly robot with click-to-blink eyes and welcoming smile.</desc>

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

            <circle cx="150" cy="110" r="92" fill="#67b7f7" opacity="0.18"/>

            <g className="stroke" strokeWidth="3" strokeLinecap="round" filter="url(#softShadow)">
              <line x1="118" y1="58" x2="98" y2="35"/>
              <circle cx="98" cy="35" r="6" className="accent" stroke="#334155"/>
              <line x1="182" y1="58" x2="202" y2="32"/>
              <circle cx="202" cy="32" r="6" className="accent" stroke="#334155"/>
            </g>

            <g filter="url(#softShadow)">
              <rect x="78" y="85" width="16" height="34" rx="6" className="body" stroke="#334155" strokeWidth="3"/>
              <rect x="206" y="85" width="16" height="34" rx="6" className="body" stroke="#334155" strokeWidth="3"/>
            </g>

            <g id="head" filter="url(#softShadow)">
              <rect x="90" y="60" width="120" height="90" rx="18" className="body" stroke="#334155" strokeWidth="3"/>
              <line x1="96" y1="76" x2="204" y2="76" stroke="#334155" strokeWidth="2" opacity="0.35"/>
            </g>

            <g id="eyes">
              <g id="leftEye">
                <circle cx="130" cy="98" r="16" className="eyeWhite" strokeWidth="3"/>
                <circle id="pupilLeft" cx="130" cy="98" r="6" className="pupil">
                  <animate attributeName="opacity" values="1;0;1" dur="0.22s" begin="1s"/>
                </circle>
                <rect x="114" y="82" width="32" height="0" fill="#e8eef7">
                  <animate attributeName="height" values="0;32;0" keyTimes="0;0.5;1" dur="0.22s" begin="1s" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"/>
                </rect>
              </g>
              <g id="rightEye">
                <circle cx="170" cy="98" r="16" className="eyeWhite" strokeWidth="3"/>
                <circle id="pupilRight" cx="170" cy="98" r="6" className="pupil">
                  <animate attributeName="opacity" values="1;0;1" dur="0.22s" begin="1s"/>
                </circle>
                <rect x="154" y="82" width="32" height="0" fill="#e8eef7">
                  <animate attributeName="height" values="0;32;0" keyTimes="0;0.5;1" dur="0.22s" begin="1s" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"/>
                </rect>
              </g>
              <circle cx="133" cy="95" r="2" fill="#ffffff" opacity="0.85"/>
              <circle cx="173" cy="95" r="2" fill="#ffffff" opacity="0.85"/>
            </g>

            <path d="M128 118 Q150 132 172 118" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <rect x="140" y="150" width="20" height="10" rx="3" className="body" stroke="#334155" strokeWidth="3"/>
            <rect x="90" y="160" width="120" height="40" rx="16" className="body" stroke="#334155" strokeWidth="3"/>
          </svg>
        );
      
      case 'shocked':
        return (
          <svg 
            id="surprisedRobotSVG" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 220" 
            role="img" 
            aria-labelledby="surprisedRobotTitle surprisedRobotDesc"
            className="robot-svg"
            onClick={() => {
              const svg = document.getElementById('surprisedRobotSVG');
              if (svg) {
                const animations = svg.querySelectorAll('animate, animateTransform');
                animations.forEach(anim => {
                  (anim as any).beginElement();
                });
              }
            }}
          >
            <title id="surprisedRobotTitle">Surprised Robot</title>
            <desc id="surprisedRobotDesc">Surprised robot with golden finish and dramatic shocked reaction!</desc>

            <defs>
              <filter id="softShadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
              <linearGradient id="bodyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#fef3c7', stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'#fde68a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#f59e0b', stopOpacity:0.8}} />
              </linearGradient>
              <linearGradient id="accentGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#fbbf24', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#d97706', stopOpacity:1}} />
              </linearGradient>
              <style>
                {`
                  .stroke2 { stroke: #374151; stroke-width: 2; }
                  .body2 { fill: url(#bodyGradient2); }
                  .accent2 { fill: url(#accentGradient2); }
                  .eyeWhite2 { fill: #ffffff; stroke: #1f2937; }
                  .highlight2 { fill: #ffffff; opacity: 0.6; }
                `}
              </style>
            </defs>

            <circle cx="150" cy="110" r="92" fill="#67b7f7" opacity="0.18"/>

            <g id="sophisticatedShock">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;-8 -15;0 0"
                dur="0.5s"
                begin="click"
              />
              
              <g filter="url(#softShadow2)">
                <line x1="125" y1="65" x2="115" y2="40" className="stroke2" strokeLinecap="round">
                  <animate attributeName="strokeWidth" values="2;4;2" dur="0.8s" begin="click"/>
                </line>
                <line x1="175" y1="65" x2="185" y2="40" className="stroke2" strokeLinecap="round">
                  <animate attributeName="strokeWidth" values="2;4;2" dur="0.8s" begin="click"/>
                </line>
                
                <circle cx="115" cy="40" r="8" className="accent2" stroke="#374151" strokeWidth="2">
                  <animate attributeName="r" values="8;12;8" dur="0.8s" begin="click"/>
                </circle>
                <circle cx="185" cy="40" r="8" className="accent2" stroke="#374151" strokeWidth="2">
                  <animate attributeName="r" values="8;12;8" dur="0.8s" begin="click"/>
                </circle>
                
                <circle cx="118" cy="37" r="3" className="highlight2"/>
                <circle cx="188" cy="37" r="3" className="highlight2"/>
              </g>

              <g filter="url(#softShadow2)">
                <rect x="95" y="65" width="110" height="80" rx="25" className="body2" stroke="#374151" strokeWidth="3"/>
                <rect x="100" y="70" width="100" height="70" rx="20" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3"/>
                <ellipse cx="150" cy="80" rx="45" ry="8" className="highlight2"/>
              </g>

              <g id="premiumEyes">
                <rect x="115" y="90" width="20" height="16" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
                <rect x="165" y="90" width="20" height="16" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
                
                <circle cx="125" cy="98" r="16" className="eyeWhite2" strokeWidth="3">
                  <animate attributeName="r" values="16;24;16" dur="0.5s" begin="click"/>
                </circle>
                <circle cx="175" cy="98" r="16" className="eyeWhite2" strokeWidth="3">
                  <animate attributeName="r" values="16;24;16" dur="0.5s" begin="click"/>
                </circle>
                
                <circle cx="125" cy="98" r="6" fill="#1f2937">
                  <animate attributeName="r" values="6;2;6" dur="0.5s" begin="click"/>
                </circle>
                <circle cx="175" cy="98" r="6" fill="#1f2937">
                  <animate attributeName="r" values="6;2;6" dur="0.5s" begin="click"/>
                </circle>
                
                <circle cx="126" cy="96" r="1.5" className="highlight2"/>
                <circle cx="176" cy="96" r="1.5" className="highlight2"/>
                
                <g stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0">
                  <animate attributeName="opacity" values="0;1;0.5;1;0" dur="0.8s" begin="click"/>
                  <path d="M105 85 Q100 80 95 85 Q90 90 95 95"/>
                  <path d="M195 85 Q200 80 205 85 Q210 90 205 95"/>
                </g>
              </g>

              <g>
                <ellipse cx="150" cy="120" rx="0" ry="0" fill="#374151">
                  <animate attributeName="rx" values="0;15;0" dur="0.5s" begin="click"/>
                  <animate attributeName="ry" values="0;20;0" dur="0.5s" begin="click"/>
                </ellipse>
              </g>

              <g filter="url(#softShadow2)">
                <rect x="95" y="145" width="110" height="50" rx="20" className="body2" stroke="#374151" strokeWidth="3"/>
                <rect x="130" y="160" width="40" height="20" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
                <circle cx="140" cy="170" r="3" className="accent2"/>
                <circle cx="150" cy="170" r="3" className="accent2"/>
                <circle cx="160" cy="170" r="3" className="accent2"/>
              </g>

              <g opacity="0">
                <animate attributeName="opacity" values="0;1;0.7;1;0" dur="0.8s" begin="click"/>
                <text x="220" y="70" fill="url(#accentGradient2)" fontSize="24" fontWeight="bold">!</text>
                <text x="60" y="80" fill="url(#accentGradient2)" fontSize="20" fontWeight="bold">!</text>
              </g>
            </g>
          </svg>
        );
      
      case 'bouncy':
        return (
          <svg 
            id="chubbyRobotSVG" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 220" 
            role="img" 
            aria-labelledby="chubbyRobotTitle chubbyRobotDesc"
            className="robot-svg"
            onClick={() => {
              const svg = document.getElementById('chubbyRobotSVG');
              if (svg) {
                const animations = svg.querySelectorAll('animate, animateTransform');
                animations.forEach(anim => {
                  (anim as any).beginElement();
                });
              }
            }}
          >
            <title id="chubbyRobotTitle">Chubby Robot</title>
            <desc id="chubbyRobotDesc">Chubby robot that jiggles when clicked!</desc>

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

            <circle cx="150" cy="110" r="92" fill="#67b7f7" opacity="0.18"/>

            <g id="bouncyBody">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;0 -8;0 0;0 -12;0 -4;0 0"
                dur="2.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;0 -25;0 5;0 -20;0 3;0 -15;0 0"
                dur="1.5s"
                begin="click"
                additive="sum"
              />
              
              <g className="stroke3" strokeWidth="3" strokeLinecap="round" filter="url(#softShadow3)">
                <line x1="130" y1="70" x2="125" y2="55">
                  <animateTransform attributeName="transform" type="rotate" values="0 127.5 62.5;-15 127.5 62.5;15 127.5 62.5;0 127.5 62.5" dur="3s" begin="0s" repeatCount="indefinite"/>
                  <animateTransform attributeName="transform" type="rotate" values="0 127.5 62.5;-30 127.5 62.5;30 127.5 62.5;-20 127.5 62.5;20 127.5 62.5;0 127.5 62.5" dur="1s" begin="click" additive="sum"/>
                </line>
                <circle cx="125" cy="55" r="5" className="accent3" stroke="#334155">
                  <animate attributeName="r" values="5;7;5" dur="3s" begin="0s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="5;10;5" dur="0.5s" begin="click"/>
                </circle>
                
                <line x1="170" y1="70" x2="175" y2="55">
                  <animateTransform attributeName="transform" type="rotate" values="0 172.5 62.5;15 172.5 62.5;-15 172.5 62.5;0 172.5 62.5" dur="3.2s" begin="0s" repeatCount="indefinite"/>
                  <animateTransform attributeName="transform" type="rotate" values="0 172.5 62.5;30 172.5 62.5;-30 172.5 62.5;20 172.5 62.5;-20 172.5 62.5;0 172.5 62.5" dur="1s" begin="click" additive="sum"/>
                </line>
                <circle cx="175" cy="55" r="5" className="accent3" stroke="#334155">
                  <animate attributeName="r" values="5;7;5" dur="3.2s" begin="0s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="5;10;5" dur="0.5s" begin="click"/>
                </circle>
              </g>

              <g id="head3" filter="url(#softShadow3)">
                <circle cx="150" cy="90" r="40" className="body3" stroke="#334155" strokeWidth="3">
                  <animate attributeName="r" values="40;42;40" dur="2.8s" begin="0s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="40;45;38;43;40" dur="1.2s" begin="click"/>
                </circle>
                
                <circle cx="115" cy="95" r="0" fill="#22c55e" opacity="0">
                  <animate attributeName="r" values="0;6;0" dur="1.2s" begin="click"/>
                  <animate attributeName="opacity" values="0;0.6;0" dur="1.2s" begin="click"/>
                </circle>
                <circle cx="185" cy="95" r="0" fill="#22c55e" opacity="0">
                  <animate attributeName="r" values="0;6;0" dur="1.2s" begin="click"/>
                  <animate attributeName="opacity" values="0;0.6;0" dur="1.2s" begin="click"/>
                </circle>
              </g>

              <g id="eyes3">
                <circle cx="135" cy="85" r="12" className="eyeWhite3" strokeWidth="3">
                  <animate attributeName="r" values="12;14;12" dur="2.6s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="165" cy="85" r="12" className="eyeWhite3" strokeWidth="3">
                  <animate attributeName="r" values="12;14;12" dur="2.8s" begin="0s" repeatCount="indefinite"/>
                </circle>
                
                <circle cx="135" cy="85" r="5" className="pupil3">
                  <animate attributeName="r" values="5;3;7;5" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="5;2;8;5" dur="0.8s" begin="click"/>
                  <animateTransform attributeName="transform" type="translate" values="0 0;-2 -1;2 1;0 0" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="165" cy="85" r="5" className="pupil3">
                  <animate attributeName="r" values="5;7;3;5" dur="2.7s" begin="0s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="5;2;8;5" dur="0.8s" begin="click"/>
                  <animateTransform attributeName="transform" type="translate" values="0 0;2 -1;-2 1;0 0" dur="2.7s" begin="0s" repeatCount="indefinite"/>
                </circle>
                
                <circle cx="140" cy="80" r="1" fill="#22c55e" opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="0.3s" begin="0s;3s;6s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="1;3;1" dur="0.3s" begin="0s;3s;6s" repeatCount="indefinite"/>
                </circle>
                <circle cx="160" cy="80" r="1" fill="#22c55e" opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="0.3s" begin="1.5s;4.5s;7.5s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="1;3;1" dur="0.3s" begin="1.5s;4.5s;7.5s" repeatCount="indefinite"/>
                </circle>
                
                <g opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="1s" begin="click"/>
                  <circle cx="125" cy="75" r="2" fill="#22c55e">
                    <animate attributeName="r" values="0;4;0" dur="1s" begin="click"/>
                  </circle>
                  <circle cx="175" cy="75" r="2" fill="#22c55e">
                    <animate attributeName="r" values="0;4;0" dur="1s" begin="click"/>
                  </circle>
                  <circle cx="150" cy="70" r="1.5" fill="#22c55e">
                    <animate attributeName="r" values="0;3;0" dur="1s" begin="click"/>
                  </circle>
                </g>
              </g>

              <path d="M125 100 Q150 120 175 100" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round">
                <animate attributeName="d" values="M125 100 Q150 120 175 100;M125 100 Q150 125 175 100;M125 100 Q150 120 175 100" dur="3s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="d" values="M125 100 Q150 120 175 100;M120 95 Q150 130 180 95;M125 100 Q150 120 175 100" dur="1s" begin="click"/>
              </path>

              <ellipse cx="150" cy="150" rx="50" ry="40" className="body3" stroke="#334155" strokeWidth="3" filter="url(#softShadow3)">
                <animate attributeName="rx" values="50;52;50" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="ry" values="40;38;40" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="rx" values="50;45;55;50" dur="1.5s" begin="click"/>
                <animate attributeName="ry" values="40;45;35;40" dur="1.5s" begin="click"/>
              </ellipse>
              
              <circle cx="150" cy="150" r="3" className="accent3">
                <animate attributeName="r" values="3;4;3" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="r" values="3;6;3" dur="0.5s" begin="click"/>
              </circle>
              
              <ellipse cx="100" cy="140" rx="15" ry="25" className="body3" stroke="#334155" strokeWidth="3">
                <animateTransform attributeName="transform" type="rotate" values="0 100 140;-10 100 140;10 100 140;0 100 140" dur="3s" begin="0s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 100 140;-25 100 140;25 100 140;-15 100 140;15 100 140;0 100 140" dur="1.5s" begin="click" additive="sum"/>
              </ellipse>
              <ellipse cx="200" cy="140" rx="15" ry="25" className="body3" stroke="#334155" strokeWidth="3">
                <animateTransform attributeName="transform" type="rotate" values="0 200 140;10 200 140;-10 200 140;0 200 140" dur="3.2s" begin="0s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 200 140;25 200 140;-25 200 140;15 200 140;-15 200 140;0 200 140" dur="1.5s" begin="click" additive="sum"/>
              </ellipse>
              
              <g opacity="0">
                <animate attributeName="opacity" values="0;1;0" dur="2s" begin="click"/>
                <circle cx="130" cy="120" r="2" fill="#22c55e">
                  <animateTransform attributeName="transform" type="translate" values="0 0;-20 -30;-25 10" dur="2s" begin="click"/>
                  <animate attributeName="r" values="2;4;0" dur="2s" begin="click"/>
                </circle>
                <circle cx="170" cy="120" r="2" fill="#22c55e">
                  <animateTransform attributeName="transform" type="translate" values="0 0;20 -30;25 10" dur="2s" begin="click"/>
                  <animate attributeName="r" values="2;4;0" dur="2s" begin="click"/>
                </circle>
                <circle cx="150" cy="110" r="1.5" fill="#22c55e">
                  <animateTransform attributeName="transform" type="translate" values="0 0;0 -40;0 15" dur="2s" begin="click"/>
                  <animate attributeName="r" values="1.5;3;0" dur="2s" begin="click"/>
                </circle>
              </g>
            </g>
          </svg>
        );

      case 'squid':
        return (
          <svg 
            id="squidRobotSVG" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 220" 
            role="img" 
            aria-labelledby="squidRobotTitle squidRobotDesc"
            className="robot-svg"
            onClick={() => {
              const svg = document.getElementById('squidRobotSVG');
              if (svg) {
                const animations = svg.querySelectorAll('animate, animateTransform');
                animations.forEach(anim => {
                  (anim as any).beginElement();
                });
              }
            }}
          >
            <title id="squidRobotTitle">Squid Robot</title>
            <desc id="squidRobotDesc">Squid robot with flowing tentacles that dance when clicked!</desc>

            <defs>
              <filter id="softShadow4" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
              <linearGradient id="squidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#e0e7ff', stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'#c7d2fe', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#a5b4fc', stopOpacity:1}} />
              </linearGradient>
              <linearGradient id="tentacleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#6366f1', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#4f46e5', stopOpacity:1}} />
              </linearGradient>
              <style>
                {`
                  .squidBody { fill: url(#squidGradient); stroke: #374151; }
                  .tentacle { fill: none; stroke: url(#tentacleGradient); stroke-linecap: round; }
                  .eyeWhite4 { fill: #ffffff; stroke: #1f2937; }
                  .pupil4 { fill: #1f2937; }
                  .highlight4 { fill: #ffffff; opacity: 0.8; }
                `}
              </style>
            </defs>

            <circle cx="150" cy="110" r="92" fill="#67b7f7" opacity="0.18"/>

            <g id="squidRobot">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;0 -8;0 0;0 -5;0 0"
                dur="4s"
                begin="0s"
                repeatCount="indefinite"
              />
              
              <g filter="url(#softShadow4)">
                <ellipse cx="150" cy="85" rx="45" ry="35" className="squidBody" strokeWidth="3"/>
                <ellipse cx="150" cy="80" rx="35" ry="25" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4"/>
                <ellipse cx="150" cy="75" rx="20" ry="12" className="highlight4"/>
              </g>

              <g className="tentacle" strokeWidth="2">
                <path d="M130 60 Q125 45 120 35">
                  <animate attributeName="d" values="M130 60 Q125 45 120 35;M130 60 Q120 40 115 30;M130 60 Q125 45 120 35" dur="3s" begin="0s" repeatCount="indefinite"/>
                </path>
                <circle cx="120" cy="35" r="4" fill="url(#tentacleGradient)">
                  <animate attributeName="r" values="4;6;4" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                </circle>
                
                <path d="M170 60 Q175 45 180 35">
                  <animate attributeName="d" values="M170 60 Q175 45 180 35;M170 60 Q180 40 185 30;M170 60 Q175 45 180 35" dur="3.2s" begin="0s" repeatCount="indefinite"/>
                </path>
                <circle cx="180" cy="35" r="4" fill="url(#tentacleGradient)">
                  <animate attributeName="r" values="4;6;4" dur="2.7s" begin="0s" repeatCount="indefinite"/>
                </circle>
              </g>

              <g id="squidEyes">
                <ellipse cx="135" cy="80" rx="12" ry="15" className="eyeWhite4" strokeWidth="2"/>
                <ellipse cx="165" cy="80" rx="12" ry="15" className="eyeWhite4" strokeWidth="2"/>
                
                <ellipse cx="135" cy="82" rx="5" ry="7" className="pupil4">
                  <animateTransform attributeName="transform" type="rotate" values="0 135 82;10 135 82;-10 135 82;0 135 82" dur="6s" begin="0s" repeatCount="indefinite"/>
                </ellipse>
                <ellipse cx="165" cy="82" rx="5" ry="7" className="pupil4">
                  <animateTransform attributeName="transform" type="rotate" values="0 165 82;-10 165 82;10 165 82;0 165 82" dur="5.5s" begin="0s" repeatCount="indefinite"/>
                </ellipse>
                
                <ellipse cx="137" cy="78" rx="2" ry="3" className="highlight4"/>
                <ellipse cx="167" cy="78" rx="2" ry="3" className="highlight4"/>
              </g>

              <path d="M140 95 Q150 105 160 95" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round">
                <animate attributeName="d" values="M140 95 Q150 105 160 95;M145 98 Q150 108 155 98;M140 95 Q150 105 160 95" dur="4s" begin="0s" repeatCount="indefinite"/>
              </path>

              <g className="tentacle" strokeWidth="4">
                <path d="M120 110 Q110 130 105 150 Q100 170 95 190">
                  <animate attributeName="d" values="M120 110 Q110 130 105 150 Q100 170 95 190;M120 110 Q105 125 95 145 Q85 165 80 185;M120 110 Q115 135 110 155 Q105 175 100 195;M120 110 Q110 130 105 150 Q100 170 95 190" dur="4s" begin="0s" repeatCount="indefinite"/>
                </path>
                <path d="M130 115 Q115 135 110 155 Q105 175 100 195">
                  <animate attributeName="d" values="M130 115 Q115 135 110 155 Q105 175 100 195;M130 115 Q120 130 115 150 Q110 170 105 190;M130 115 Q125 140 120 160 Q115 180 110 200;M130 115 Q115 135 110 155 Q105 175 100 195" dur="4.2s" begin="0s" repeatCount="indefinite"/>
                </path>
                
                <path d="M145 120 Q140 140 135 160 Q130 180 125 200">
                  <animate attributeName="d" values="M145 120 Q140 140 135 160 Q130 180 125 200;M145 120 Q135 135 130 155 Q125 175 120 195;M145 120 Q145 145 140 165 Q135 185 130 205;M145 120 Q140 140 135 160 Q130 180 125 200" dur="3.8s" begin="0s" repeatCount="indefinite"/>
                </path>
                <path d="M155 120 Q160 140 165 160 Q170 180 175 200">
                  <animate attributeName="d" values="M155 120 Q160 140 165 160 Q170 180 175 200;M155 120 Q165 135 170 155 Q175 175 180 195;M155 120 Q155 145 160 165 Q165 185 170 205;M155 120 Q160 140 165 160 Q170 180 175 200" dur="3.9s" begin="0s" repeatCount="indefinite"/>
                </path>
                
                <path d="M170 115 Q185 135 190 155 Q195 175 200 195">
                  <animate attributeName="d" values="M170 115 Q185 135 190 155 Q195 175 200 195;M170 115 Q180 130 185 150 Q190 170 195 190;M170 115 Q175 140 180 160 Q185 180 190 200;M170 115 Q185 135 190 155 Q195 175 200 195" dur="4.1s" begin="0s" repeatCount="indefinite"/>
                </path>
                <path d="M180 110 Q190 130 195 150 Q200 170 205 190">
                  <animate attributeName="d" values="M180 110 Q190 130 195 150 Q200 170 205 190;M180 110 Q195 125 200 145 Q205 165 210 185;M180 110 Q185 135 190 155 Q195 175 200 195;M180 110 Q190 130 195 150 Q200 170 205 190" dur="4.3s" begin="0s" repeatCount="indefinite"/>
                </path>
              </g>

              <g fill="url(#tentacleGradient)" opacity="0.7">
                <circle cx="100" cy="170" r="2">
                  <animate attributeName="r" values="2;3;2" dur="2.5s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="110" cy="175" r="2">
                  <animate attributeName="r" values="2;3;2" dur="2.7s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="130" cy="180" r="2">
                  <animate attributeName="r" values="2;3;2" dur="2.6s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="170" cy="180" r="2">
                  <animate attributeName="r" values="2;3;2" dur="2.8s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="190" cy="175" r="2">
                  <animate attributeName="r" values="2;3;2" dur="2.4s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="200" cy="170" r="2">
                  <animate attributeName="r" values="2;3;2" dur="2.9s" begin="0s" repeatCount="indefinite"/>
                </circle>
              </g>

              <g fill="#6366f1" opacity="0">
                <animate attributeName="opacity" values="0;0.8;0.3;0.8;0" dur="5s" begin="0s" repeatCount="indefinite"/>
                <circle cx="125" cy="70" r="2"/>
                <circle cx="175" cy="70" r="2"/>
                <circle cx="140" cy="85" r="1.5"/>
                <circle cx="160" cy="85" r="1.5"/>
                <circle cx="150" cy="95" r="1"/>
              </g>
            </g>
          </svg>
        );

      default:
        return <div>Robot</div>;
    }
  };

  return (
    <div className={`robot-decoration robot-${position}`}>
      <div className="robot-wrapper">
        {getRobotSVG()}
      </div>
    </div>
  );
};

const client = generateClient();

interface GraphQLError {
  errors?: Array<{ message: string }>;
  networkError?: { message: string };
  message?: string;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Apply theme to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setSubmitStatus('loading');

    try {
      console.log('Sending GraphQL request with variables:', {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      const response = await client.graphql<SendMessageMutation>({
        query: mutations.sendMessage,
        variables: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        },
        authMode: 'apiKey'
      });

      console.log('Full GraphQL Response:', response);

      if ('data' in response && response.data?.sendMessage) {
        console.log('Success response data:', response.data.sendMessage);
        setSubmitStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error('GraphQL Response (no data):', response);
        throw new Error('Failed to send message - no data returned');
      }
    } catch (error: unknown) {
      const graphqlError = error as GraphQLError;
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        graphqlErrors: graphqlError.errors,
        networkError: graphqlError.networkError,
        response: graphqlError
      };

      console.error('Error details:', errorDetails);

      let errorMessage = 'Failed to send message';
      if (graphqlError.errors?.[0]?.message) {
        errorMessage = graphqlError.errors[0].message;
      } else if (graphqlError.networkError?.message) {
        errorMessage = graphqlError.networkError.message;
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error('Error sending email:', errorMessage);
      setSubmitStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const updatedData = {
      ...formData,
      [id]: value
    };
    setFormData(updatedData);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Elevator Robot</h1>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                Contact Us
              </button>
            </nav>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-container bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 dark:from-gray-900 dark:via-blue-900 dark:to-black overflow-hidden">
        {/* Subtle animated background elements */}
        <div className="hero-background">
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
          <div className="bg-element bg-element-3"></div>
        </div>
        
        {/* Robot Decorations */}
        <RobotDecoration type="blinking" position="top-right" />
        <RobotDecoration type="shocked" position="top-left" />
        <RobotDecoration type="bouncy" position="bottom-right" />
        <RobotDecoration type="squid" position="bottom-left" />

        {/* Hero Content */}
        <div className="hero-content">
          <h2 className="hero-title">
            We Build the Future: <span className="hero-highlight">Custom AI Solutions</span> for Your Business
          </h2>
          <p className="hero-description">
            Tailored AI and web applications designed to deliver results.
          </p>
          <button
            onClick={() => scrollToSection('contact')}
            className="hero-cta"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Us</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                At Elevator Robot, we specialize in creating tailored AI and web applications that bring your ideas to life. We focus on innovative, AI-driven solutions and experimental projects that set you apart. Whether you need a smart chatbot or a full AI-powered platform, we deliver with precision and creativity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Project 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <h4 className="font-semibold text-sm">AI Assistant</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18z"/>
                        </svg>
                      </div>
                      <h4 className="font-semibold text-sm">Automation Tool</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-red-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                      </div>
                      <h4 className="font-semibold text-sm">Analytics Platform</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-r from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We offer cutting-edge solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI-Powered Applications */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Applications</h4>
              <p className="text-gray-600 dark:text-gray-300">Custom AI tools and systems built for your specific needs and requirements.</p>
            </div>

            {/* Chatbots & Virtual Assistants */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Chatbots & Virtual Assistants</h4>
              <p className="text-gray-600 dark:text-gray-300">Intelligent bots to automate interactions and enhance customer experience.</p>
            </div>

            {/* Web & API Development */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Web & API Development</h4>
              <p className="text-gray-600 dark:text-gray-300">Scalable, secure, and fast solutions built with modern technologies.</p>
            </div>

            {/* Innovation Projects */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation Projects</h4>
              <p className="text-gray-600 dark:text-gray-300">Experimental and cutting-edge builds that push the boundaries of technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ready to elevate your business with AI? Let's discuss your project.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-blue-100 dark:border-gray-700">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project..."
                />
              </div>
              
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 font-medium">Message sent successfully!</p>
                  <p className="text-blue-600 text-sm mt-1">We'll get back to you within 1 business day.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Failed to send message. Please try again.</p>
                </div>
              )}
            </form>
            

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-cyan-900 dark:from-gray-900 dark:to-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200 dark:text-gray-400">© 2025 Elevator Robot. Building the future with AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
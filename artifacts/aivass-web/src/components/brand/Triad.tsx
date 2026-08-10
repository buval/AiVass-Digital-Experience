import { SVGProps } from "react";

export function Triad(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 300 260" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* connecting lines */}
      <line x1="150" y1="40" x2="40" y2="210" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
      <line x1="150" y1="40" x2="260" y2="210" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
      <line x1="40" y1="210" x2="260" y2="210" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
      {/* top node */}
      <path d="M150 28 L153 37 L162 40 L153 43 L150 52 L147 43 L138 40 L147 37Z" fill="currentColor"/>
      {/* bottom-left node */}
      <path d="M40 198 L43 207 L52 210 L43 213 L40 222 L37 213 L28 210 L37 207Z" fill="currentColor"/>
      {/* bottom-right node */}
      <path d="M260 198 L263 207 L272 210 L263 213 L260 222 L257 213 L248 210 L257 207Z" fill="currentColor"/>
    </svg>
  );
}

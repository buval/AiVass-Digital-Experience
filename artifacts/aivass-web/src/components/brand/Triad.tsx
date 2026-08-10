import { SVGProps } from "react";

/**
 * Official AiVass T1 Triad — upright, one top apex, two lower nodes.
 * Geometry matches the verified brand asset (aivass-triad-light.svg / aivass-triad-oxblood.svg).
 * Uses currentColor so it renders correctly on both navy (text-ox-light) and light (text-oxblood) surfaces.
 */
export function Triad(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* triangle outline — faint connecting lines */}
      <path
        d="M60 22.0 L24.0 92.0 L96.0 92.0 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity="0.38"
        strokeLinejoin="round"
      />
      {/* top node — four-pointed star */}
      <path
        d="M60 7.0 L64.80 17.20 L75 22.0 L64.80 26.80 L60 37.0 L55.20 26.80 L45 22.0 L55.20 17.20 Z"
        fill="currentColor"
      />
      {/* bottom-left node — four-pointed star */}
      <path
        d="M24.0 77.0 L28.80 87.20 L39.0 92.0 L28.80 96.80 L24.0 107.0 L19.20 96.80 L9.0 92.0 L19.20 87.20 Z"
        fill="currentColor"
      />
      {/* bottom-right node — four-pointed star */}
      <path
        d="M96.0 77.0 L100.80 87.20 L111.0 92.0 L100.80 96.80 L96.0 107.0 L91.20 96.80 L81.0 92.0 L91.20 87.20 Z"
        fill="currentColor"
      />
    </svg>
  );
}

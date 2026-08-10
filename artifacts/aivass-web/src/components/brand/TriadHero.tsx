import { useEffect, useState } from "react";

export function TriadHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center">
      {/* Arch */}
      <div 
        className={`absolute w-[68%] h-[82%] border border-navy/20 border-b-0 rounded-t-[300px] transition-opacity duration-[1200ms] ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      />
      
      {/* Orbital Ring */}
      <div 
        className={`absolute w-[94%] h-[94%] border border-oxblood/20 rounded-full animate-spin-slow transition-opacity duration-700 ease-out delay-100 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Triad Base Vector */}
      <svg 
        viewBox="0 0 300 260" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-[88%] max-w-[500px] text-navy-mid"
      >
        {/* lines */}
        <line 
          x1="150" y1="40" x2="40" y2="210" 
          stroke="currentColor" strokeWidth="0.8" opacity="0.6"
          strokeDasharray="300"
          strokeDashoffset={mounted ? "0" : "300"}
          className="transition-all duration-[1500ms] ease-out delay-300"
        />
        <line 
          x1="150" y1="40" x2="260" y2="210" 
          stroke="currentColor" strokeWidth="0.8" opacity="0.6"
          strokeDasharray="300"
          strokeDashoffset={mounted ? "0" : "300"}
          className="transition-all duration-[1500ms] ease-out delay-300"
        />
        <line 
          x1="40" y1="210" x2="260" y2="210" 
          stroke="currentColor" strokeWidth="0.8" opacity="0.6"
          strokeDasharray="300"
          strokeDashoffset={mounted ? "0" : "300"}
          className="transition-all duration-[1500ms] ease-out delay-300"
        />
        
        <g className="text-oxblood">
          {/* top node */}
          <path 
            d="M150 28 L153 37 L162 40 L153 43 L150 52 L147 43 L138 40 L147 37Z" 
            fill="currentColor"
            className={`transition-opacity duration-500 ease-out delay-[1400ms] ${mounted ? "opacity-100" : "opacity-0"}`}
          />
          {/* bottom-left node */}
          <path 
            d="M40 198 L43 207 L52 210 L43 213 L40 222 L37 213 L28 210 L37 207Z" 
            fill="currentColor"
            className={`transition-opacity duration-500 ease-out delay-[1600ms] ${mounted ? "opacity-100" : "opacity-0"}`}
          />
          {/* bottom-right node */}
          <path 
            d="M260 198 L263 207 L272 210 L263 213 L260 222 L257 213 L248 210 L257 207Z" 
            fill="currentColor"
            className={`transition-opacity duration-500 ease-out delay-[1800ms] ${mounted ? "opacity-100" : "opacity-0"}`}
          />
        </g>
      </svg>
    </div>
  );
}

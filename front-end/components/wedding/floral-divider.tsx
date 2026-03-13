interface FloralDividerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FloralDivider({ className = "", size = "md" }: FloralDividerProps) {
  const dims = size === "sm" ? { w: 160, h: 20 } : size === "lg" ? { w: 280, h: 28 } : { w: 220, h: 24 };

  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      fill="none"
      className={`text-primary/50 mx-auto ${className}`}
      aria-hidden="true"
    >
      {/* Left line */}
      <line x1="0" y1={dims.h / 2} x2={dims.w * 0.34} y2={dims.h / 2} stroke="currentColor" strokeWidth="0.6" />

      {/* Left leaf (upper) */}
      <path
        d={`M${dims.w * 0.24} ${dims.h / 2} C${dims.w * 0.26} ${dims.h * 0.15} ${dims.w * 0.31} ${dims.h * 0.08} ${dims.w * 0.33} ${dims.h * 0.38} C${dims.w * 0.31} ${dims.h * 0.55} ${dims.w * 0.25} ${dims.h * 0.55} ${dims.w * 0.24} ${dims.h / 2}Z`}
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {/* Left leaf (lower) */}
      <path
        d={`M${dims.w * 0.33} ${dims.h / 2} C${dims.w * 0.35} ${dims.h * 0.78} ${dims.w * 0.4} ${dims.h * 0.9} ${dims.w * 0.42} ${dims.h * 0.6} C${dims.w * 0.4} ${dims.h * 0.44} ${dims.w * 0.34} ${dims.h * 0.44} ${dims.w * 0.33} ${dims.h / 2}Z`}
        stroke="currentColor"
        strokeWidth="0.6"
      />

      {/* Center: small diamond with dot */}
      <path
        d={`M${dims.w / 2} ${dims.h * 0.15} L${dims.w / 2 + dims.h * 0.35} ${dims.h / 2} L${dims.w / 2} ${dims.h * 0.85} L${dims.w / 2 - dims.h * 0.35} ${dims.h / 2}Z`}
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <circle cx={dims.w / 2} cy={dims.h / 2} r={dims.h * 0.1} fill="currentColor" />

      {/* Right leaf (upper) - mirror */}
      <path
        d={`M${dims.w * 0.76} ${dims.h / 2} C${dims.w * 0.74} ${dims.h * 0.15} ${dims.w * 0.69} ${dims.h * 0.08} ${dims.w * 0.67} ${dims.h * 0.38} C${dims.w * 0.69} ${dims.h * 0.55} ${dims.w * 0.75} ${dims.h * 0.55} ${dims.w * 0.76} ${dims.h / 2}Z`}
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {/* Right leaf (lower) - mirror */}
      <path
        d={`M${dims.w * 0.67} ${dims.h / 2} C${dims.w * 0.65} ${dims.h * 0.78} ${dims.w * 0.6} ${dims.h * 0.9} ${dims.w * 0.58} ${dims.h * 0.6} C${dims.w * 0.6} ${dims.h * 0.44} ${dims.w * 0.66} ${dims.h * 0.44} ${dims.w * 0.67} ${dims.h / 2}Z`}
        stroke="currentColor"
        strokeWidth="0.6"
      />

      {/* Right line */}
      <line x1={dims.w * 0.66} y1={dims.h / 2} x2={dims.w} y2={dims.h / 2} stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

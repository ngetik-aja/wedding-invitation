"use client";

import { FloralDivider } from "./floral-divider";

interface ThemeSectionDividerProps {
  theme?: string;
  className?: string;
}

// Small rustic branch for section headings
function RusticBranchSmall() {
  return (
    <svg
      className="text-primary/55 pointer-events-none mx-auto"
      width="160"
      height="24"
      viewBox="0 0 160 24"
      fill="none"
      aria-hidden="true"
    >
      <line x1="0" y1="12" x2="160" y2="12" stroke="currentColor" strokeWidth="0.6" />
      <rect x="76" y="8" width="8" height="8" transform="rotate(45 80 12)" fill="currentColor" />
      <path d="M64 12 C61 6 55 4 53 8 C55 12 61 14 64 12Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.5" />
      <path d="M64 12 C61 18 55 20 53 16 C55 12 61 10 64 12Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.5" />
      <path d="M48 12 C45 6 39 4 37 8 C39 12 45 14 48 12Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <path d="M48 12 C45 18 39 20 37 16 C39 12 45 10 48 12Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <path d="M96 12 C99 6 105 4 107 8 C105 12 99 14 96 12Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.5" />
      <path d="M96 12 C99 18 105 20 107 16 C105 12 99 10 96 12Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.5" />
      <path d="M112 12 C115 6 121 4 123 8 C121 12 115 14 112 12Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <path d="M112 12 C115 18 121 20 123 16 C121 12 115 10 112 12Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" opacity="0.35" />
      <circle cx="154" cy="12" r="1.5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

// Small tropical wave for section headings
function TropicalWaveSmall() {
  return (
    <svg
      className="text-primary/45 pointer-events-none mx-auto"
      width="180"
      height="16"
      viewBox="0 0 180 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 8 C22.5 2 22.5 14 45 8 C67.5 2 67.5 14 90 8 C112.5 2 112.5 14 135 8 C157.5 2 157.5 14 180 8"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M0 12 C22.5 6 22.5 18 45 12 C67.5 6 67.5 18 90 12 C112.5 6 112.5 18 135 12 C157.5 6 157.5 18 180 12"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

export function ThemeSectionDivider({ theme, className = "" }: ThemeSectionDividerProps) {
  if (theme === "modern") {
    return (
      <div className={`flex items-center justify-center gap-3 mt-4 ${className}`}>
        <div className="h-px w-8 bg-primary" />
        <div className="w-1.5 h-1.5 bg-primary" />
        <div className="h-px w-8 bg-primary" />
      </div>
    );
  }
  if (theme === "rustic") {
    return <div className={`mt-4 ${className}`}><RusticBranchSmall /></div>;
  }
  if (theme === "gold") {
    return (
      <div className={`flex items-center justify-center gap-3 mt-4 ${className}`}>
        <div className="h-px w-16 bg-primary/45" />
        <span className="text-primary/70 text-xs tracking-[0.4em]">✦ ✦ ✦</span>
        <div className="h-px w-16 bg-primary/45" />
      </div>
    );
  }
  if (theme === "tropical") {
    return <div className={`mt-4 ${className}`}><TropicalWaveSmall /></div>;
  }
  if (theme === "floral") {
    return <FloralDivider size="md" className={`mt-4 opacity-70 ${className}`} />;
  }
  // elegant default — more prominent
  return <FloralDivider size="md" className={`mt-4 opacity-80 ${className}`} />;
}

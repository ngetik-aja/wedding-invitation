"use client";

import { Heart } from "lucide-react";
import { FloralDivider } from "./floral-divider";

interface HeroSectionProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
  guestLabel?: string;
  guestName?: string;
  theme?: string;
}

function ElegantCornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute w-16 h-16 text-primary/60 pointer-events-none ${className ?? ""}`}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {/* Corner lines */}
      <line x1="0" y1="4" x2="64" y2="4" stroke="currentColor" strokeWidth="0.75" />
      <line x1="4" y1="0" x2="4" y2="64" stroke="currentColor" strokeWidth="0.75" />
      {/* Corner dot */}
      <circle cx="4" cy="4" r="2.5" fill="currentColor" />
      {/* Leaf 1 — extends toward interior horizontally */}
      <path
        d="M4 4 C8 5 12 14 7 16 C3 12 3 7 4 4Z"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Leaf 2 — extends toward interior vertically */}
      <path
        d="M4 4 C5 8 14 12 16 7 C12 3 7 3 4 4Z"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Small accent dots at leaf tips */}
      <circle cx="8" cy="14" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="14" cy="8" r="1.2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function HeroSection({
  brideName,
  groomName,
  weddingDate,
  guestLabel,
  guestName,
  theme,
}: HeroSectionProps) {
  const isModern = theme === "modern";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
      {/* Elegant: warm radial glow + subtle dot pattern */}
      {!isModern && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-[700px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* Modern: geometric frame */}
      {isModern && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute left-0 right-0 top-16 h-px bg-border" />
          <div className="pointer-events-none absolute left-0 right-0 bottom-16 h-px bg-border" />
          <div className="pointer-events-none absolute left-12 top-0 bottom-0 w-px bg-border/50 hidden md:block" />
          <div className="pointer-events-none absolute right-12 top-0 bottom-0 w-px bg-border/50 hidden md:block" />
          <div className="pointer-events-none absolute top-16 left-12 w-10 h-10 border-t-2 border-l-2 border-primary hidden md:block" />
          <div className="pointer-events-none absolute top-16 right-12 w-10 h-10 border-t-2 border-r-2 border-primary hidden md:block" />
          <div className="pointer-events-none absolute bottom-16 left-12 w-10 h-10 border-b-2 border-l-2 border-primary hidden md:block" />
          <div className="pointer-events-none absolute bottom-16 right-12 w-10 h-10 border-b-2 border-r-2 border-primary hidden md:block" />
        </>
      )}

      {isModern ? (
        /* ── Modern layout ── */
        <div className="max-w-2xl mx-auto w-full">
          {(guestLabel || guestName) && (
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Dear
              </p>
              {guestLabel && (
                <p className="text-lg font-medium text-foreground">{guestLabel}</p>
              )}
              {guestName && (
                <p className="mt-1 text-lg uppercase font-bold tracking-wider text-foreground/90">
                  {guestName}
                </p>
              )}
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">
            You are cordially invited to the wedding of
          </p>

          <div className="space-y-1 mb-10">
            <h1 className="font-serif text-foreground text-6xl md:text-8xl font-light tracking-tight">
              {brideName}
            </h1>
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="h-px w-16 bg-primary/40" />
              <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground">
                and
              </span>
              <div className="h-px w-16 bg-primary/40" />
            </div>
            <h1 className="font-serif text-foreground text-6xl md:text-8xl font-light tracking-tight">
              {groomName}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-primary/60" />
            <p className="font-sans text-sm uppercase tracking-[0.25em] text-muted-foreground">
              {weddingDate}
            </p>
            <div className="h-px w-12 bg-primary/60" />
          </div>
        </div>
      ) : (
        /* ── Elegant layout: ornamental frame ── */
        <div className="relative max-w-lg mx-auto w-full">
          {/* Outer border */}
          <div className="absolute inset-0 border border-primary/40 pointer-events-none" />
          {/* Inner border (double-line effect) */}
          <div className="absolute inset-[8px] border border-primary/20 pointer-events-none" />

          {/* Corner ornaments */}
          <ElegantCornerOrnament className="top-0 left-0" />
          <ElegantCornerOrnament className="top-0 right-0 [transform:scaleX(-1)]" />
          <ElegantCornerOrnament className="bottom-0 left-0 [transform:scaleY(-1)]" />
          <ElegantCornerOrnament className="bottom-0 right-0 [transform:scale(-1)]" />

          {/* Inner content */}
          <div className="relative px-12 py-14 md:px-16 md:py-16">
            {(guestLabel || guestName) && (
              <div className="mb-10">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Dear
                </p>
                {guestLabel && (
                  <p className="text-lg font-medium text-foreground">{guestLabel}</p>
                )}
                {guestName && (
                  <p className="mt-1 text-lg uppercase font-bold tracking-wider text-foreground/90">
                    {guestName}
                  </p>
                )}
              </div>
            )}

            <FloralDivider size="sm" className="mb-8 opacity-70" />

            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">
              You are cordially invited to the wedding of
            </p>

            <div className="space-y-1 mb-10">
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="h-px w-16 bg-border" />
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <div className="h-px w-16 bg-border" />
              </div>
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {groomName}
              </h1>
            </div>

            <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8">
              {weddingDate}
            </p>
            <FloralDivider size="md" className="opacity-60" />
          </div>
        </div>
      )}
    </section>
  );
}

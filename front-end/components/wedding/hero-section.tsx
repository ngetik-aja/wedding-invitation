"use client";

import { Heart, Leaf } from "lucide-react";
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

function GoldCornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute w-16 h-16 text-primary/70 pointer-events-none ${className ?? ""}`}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {/* Primary corner lines */}
      <line x1="0" y1="4" x2="64" y2="4" stroke="currentColor" strokeWidth="1" />
      <line x1="4" y1="0" x2="4" y2="64" stroke="currentColor" strokeWidth="1" />
      {/* Double accent lines (offset by 4px) */}
      <line x1="0" y1="8" x2="40" y2="8" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
      <line x1="8" y1="0" x2="8" y2="40" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
      {/* Corner diamond */}
      <rect x="1.5" y="1.5" width="5" height="5" transform="rotate(45 4 4)" fill="currentColor" />
      {/* Dots along horizontal line */}
      <circle cx="14" cy="4" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="4" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="4" r="1" fill="currentColor" opacity="0.4" />
      {/* Dots along vertical line */}
      <circle cx="4" cy="14" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="4" cy="22" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="4" cy="30" r="1" fill="currentColor" opacity="0.4" />
      {/* Small inner accent diamond */}
      <rect x="9" y="9" width="4" height="4" transform="rotate(45 11 11)" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

function FloralCornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute w-16 h-16 text-primary/50 pointer-events-none ${className ?? ""}`}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {/* Soft corner line */}
      <line x1="0" y1="4" x2="48" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="4" y1="0" x2="4" y2="48" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      {/* Center flower at corner */}
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      {/* Petals radiating from corner */}
      <ellipse cx="4" cy="12" rx="2.5" ry="5" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx="12" cy="4" rx="5" ry="2.5" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx="9" cy="9" rx="3" ry="5.5" transform="rotate(45 9 9)" fill="currentColor" fillOpacity="0.2" />
      {/* Smaller secondary petals */}
      <circle cx="18" cy="8" r="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="8" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" fillOpacity="0.15" />
      {/* Tiny accent dots */}
      <circle cx="24" cy="6" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="6" cy="24" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function RusticBranch() {
  return (
    <svg
      className="text-primary/60 pointer-events-none"
      width="240"
      height="36"
      viewBox="0 0 240 36"
      fill="none"
      aria-hidden="true"
    >
      {/* Center stem line */}
      <line x1="0" y1="18" x2="240" y2="18" stroke="currentColor" strokeWidth="1" />

      {/* Center diamond dot */}
      <rect x="116" y="14" width="8" height="8" transform="rotate(45 120 18)" fill="currentColor" />

      {/* Left leaf pair 1 (closest to center) */}
      <path d="M100 18 C96 10 88 8 86 12 C88 18 96 20 100 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <path d="M100 18 C96 26 88 28 86 24 C88 18 96 16 100 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />

      {/* Left leaf pair 2 */}
      <path d="M76 18 C72 10 64 8 62 12 C64 18 72 20 76 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <path d="M76 18 C72 26 64 28 62 24 C64 18 72 16 76 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />

      {/* Left leaf pair 3 (outer) */}
      <path d="M50 18 C46 10 38 8 36 12 C38 18 46 20 50 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <path d="M50 18 C46 26 38 28 36 24 C38 18 46 16 50 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />

      {/* Right leaf pair 1 (closest to center) */}
      <path d="M140 18 C144 10 152 8 154 12 C152 18 144 20 140 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <path d="M140 18 C144 26 152 28 154 24 C152 18 144 16 140 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />

      {/* Right leaf pair 2 */}
      <path d="M164 18 C168 10 176 8 178 12 C176 18 168 20 164 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <path d="M164 18 C168 26 176 28 178 24 C176 18 168 16 164 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />

      {/* Right leaf pair 3 (outer) */}
      <path d="M190 18 C194 10 202 8 204 12 C202 18 194 20 190 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />
      <path d="M190 18 C194 26 202 28 204 24 C202 18 194 16 190 18Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6" />

      {/* Tip dots */}
      <circle cx="8" cy="18" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="232" cy="18" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function TropicalWave() {
  return (
    <svg
      className="text-primary/50 pointer-events-none"
      width="280"
      height="24"
      viewBox="0 0 280 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Upper wave */}
      <path
        d="M0 10 C20 4 40 4 60 10 C80 16 100 16 120 10 C140 4 160 4 180 10 C200 16 220 16 240 10 C260 4 270 4 280 10"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      {/* Lower wave (offset) */}
      <path
        d="M0 16 C20 10 40 10 60 16 C80 22 100 22 120 16 C140 10 160 10 180 16 C200 22 220 22 240 16 C260 10 270 10 280 16"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
        opacity="0.4"
      />
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
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default (anything not matched above and not modern)

  return (
    <section className={`relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center ${isFloral ? "" : "overflow-hidden"}`}>

      {/* ── Backgrounds ── */}

      {/* Modern: clean bg only */}
      {isModern && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
      )}

      {/* Rustic: earthy radial glow + dot pattern */}
      {isRustic && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-[700px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* Gold: radial glow + subtle 45deg diamond grid */}
      {isGold && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-10 [background-image:repeating-linear-gradient(45deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] [background-size:20px_20px] text-primary" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-[700px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* Tropical: radial glow + dot pattern + horizontal shimmer */}
      {isTropical && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] [background-image:repeating-linear-gradient(180deg,transparent_0,transparent_3px,currentColor_3px,currentColor_4px)] text-primary" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-[700px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* Floral: radial glow + dot pattern */}
      {isFloral && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-[700px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* Elegant (default): warm radial glow + dot pattern */}
      {!isModern && !isRustic && !isGold && !isTropical && !isFloral && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-[700px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* ── Layouts ── */}

      {isModern ? (
        /* ── Modern layout: geometric frame around content ── */
        <div className="relative max-w-2xl mx-auto w-full">
          {/* Full border */}
          <div className="absolute inset-0 border border-border pointer-events-none" />
          {/* Bold corner accents — responsive, inside the content box */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary pointer-events-none" />

          <div className="relative px-10 py-14 md:px-16 md:py-16">
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
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-light tracking-tight">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="h-px w-16 bg-primary/40" />
                <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground">
                  and
                </span>
                <div className="h-px w-16 bg-primary/40" />
              </div>
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-light tracking-tight">
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
        </div>

      ) : isRustic ? (
        /* ── Rustic layout: botanical sprigs, no frame box ── */
        <div className="max-w-lg mx-auto w-full">
          <RusticBranch />

          <div className="mt-8 mb-8 px-4">
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
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="h-px w-16 bg-border" />
                <Leaf className="w-5 h-5 text-primary fill-primary/30" />
                <div className="h-px w-16 bg-border" />
              </div>
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {groomName}
              </h1>
            </div>

            <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8">
              {weddingDate}
            </p>
          </div>

          <RusticBranch />
        </div>

      ) : isGold ? (
        /* ── Gold layout: triple border, luxury diamond ornaments ── */
        <div className="relative max-w-lg mx-auto w-full">
          {/* Triple border — thick outer, thin inner lines */}
          <div className="absolute inset-0 border-2 border-primary/60 pointer-events-none" />
          <div className="absolute inset-[6px] border border-primary/35 pointer-events-none" />
          <div className="absolute inset-[12px] border border-primary/18 pointer-events-none" />

          {/* Gold corner ornaments — large luxury */}
          <GoldCornerOrnament className="top-0 left-0" />
          <GoldCornerOrnament className="top-0 right-0 [transform:scaleX(-1)]" />
          <GoldCornerOrnament className="bottom-0 left-0 [transform:scaleY(-1)]" />
          <GoldCornerOrnament className="bottom-0 right-0 [transform:scale(-1)]" />

          <div className="relative bg-primary/[0.03] px-14 py-16 md:px-18 md:py-18">
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

            {/* Gold: ornate ✦ line divider — NOT floral */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px flex-1 bg-primary/40" />
              <span className="text-primary text-sm tracking-[0.4em]">✦ ✦ ✦</span>
              <div className="h-px flex-1 bg-primary/40" />
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-10">
              You are cordially invited to the wedding of
            </p>

            <div className="space-y-1 mb-10">
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-semibold tracking-wide">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="h-px w-16 bg-primary/50" />
                <span className="text-primary/80 text-lg">✦</span>
                <div className="h-px w-16 bg-primary/50" />
              </div>
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-semibold tracking-wide">
                {groomName}
              </h1>
            </div>

            <p className="font-serif text-xl md:text-2xl text-foreground/70 mb-8 tracking-widest uppercase text-sm">
              {weddingDate}
            </p>

            {/* Bottom ornate divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-primary/40" />
              <span className="text-primary text-sm tracking-[0.4em]">✦ ✦ ✦</span>
              <div className="h-px flex-1 bg-primary/40" />
            </div>
          </div>
        </div>

      ) : isTropical ? (
        /* ── Tropical layout: waves, no frame box ── */
        <div className="max-w-lg mx-auto w-full">
          <TropicalWave />

          <div className="mt-8 mb-8 px-4">
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
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="h-px w-16 bg-accent/60" />
                <span className="text-accent text-xl">✦</span>
                <div className="h-px w-16 bg-accent/60" />
              </div>
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {groomName}
              </h1>
            </div>

            <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8">
              {weddingDate}
            </p>
          </div>

          <TropicalWave />
        </div>

      ) : isFloral ? (
        /* ── Floral layout: open dreamy, NO frame, floating petal clusters ── */
        <div className="relative max-w-lg mx-auto w-full px-6">
          {/* Large petal clusters at corners — overflow-hidden removed on section so no clipping */}
          <FloralCornerOrnament className="-top-8 -left-8 !w-28 !h-28 opacity-80" />
          <FloralCornerOrnament className="-top-8 -right-8 !w-28 !h-28 opacity-80 [transform:scaleX(-1)]" />
          <FloralCornerOrnament className="-bottom-8 -left-8 !w-24 !h-24 opacity-60 [transform:scaleY(-1)]" />
          <FloralCornerOrnament className="-bottom-8 -right-8 !w-24 !h-24 opacity-60 [transform:scale(-1)]" />

          <div className="relative py-12 text-center">
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

            <FloralDivider size="md" className="mb-8 opacity-80" />

            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">
              You are cordially invited to the wedding of
            </p>

            <div className="space-y-1 mb-10">
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {brideName}
              </h1>
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="h-px w-12 bg-primary/30" />
                <span className="text-primary text-2xl">✿</span>
                <div className="h-px w-12 bg-primary/30" />
              </div>
              <h1 className="font-serif text-foreground text-5xl md:text-7xl font-medium">
                {groomName}
              </h1>
            </div>

            <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8">
              {weddingDate}
            </p>
            <FloralDivider size="lg" className="opacity-60" />
          </div>
        </div>

      ) : (
        /* ── Elegant layout (default): double border, ornamental frame ── */
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

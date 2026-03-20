"use client";

import { Heart, Leaf } from "lucide-react";
import { FloralDivider } from "./floral-divider";

interface FooterSectionProps {
  brideName: string;
  groomName: string;
  theme?: string;
}

export function FooterSection({ brideName, groomName, theme }: FooterSectionProps) {
  const isModern = theme === "modern";
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default

  const getNameClass = () => {
    if (isModern)
      return "font-sans font-light text-2xl md:text-3xl text-foreground tracking-[0.2em] uppercase mb-4";
    if (isRustic)
      return "font-serif text-2xl md:text-3xl text-foreground mb-4";
    if (isGold)
      return "font-serif tracking-widest text-2xl md:text-3xl text-foreground mb-4";
    if (isTropical)
      return "font-sans text-2xl md:text-3xl text-foreground mb-4";
    if (isFloral)
      return "font-serif italic text-2xl md:text-3xl text-foreground mb-4";
    // elegant default
    return "font-serif text-2xl md:text-3xl text-foreground mb-4";
  };

  const renderDivider = () => {
    if (isModern) {
      return (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-border" />
          <div className="w-2 h-2 bg-primary" />
          <div className="h-px w-12 bg-border" />
        </div>
      );
    }
    if (isRustic) {
      return (
        <div className="flex items-center justify-center gap-3 mb-6 text-primary/50">
          <Leaf className="w-4 h-4" />
          <Leaf className="w-5 h-5" />
          <Leaf className="w-4 h-4" />
        </div>
      );
    }
    if (isGold) {
      return (
        <div className="mb-6">
          <FloralDivider size="md" className="opacity-70" />
        </div>
      );
    }
    if (isTropical) {
      return (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-border" />
          <span className="text-accent text-base tracking-widest">✦ ✦ ✦</span>
          <div className="h-px w-12 bg-border" />
        </div>
      );
    }
    if (isFloral) {
      return (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-border" />
          <span className="text-primary text-base tracking-widest">✿ ✿ ✿</span>
          <div className="h-px w-12 bg-border" />
        </div>
      );
    }
    // elegant default
    return (
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px w-12 bg-border" />
        <Heart className="w-5 h-5 text-primary fill-primary" />
        <div className="h-px w-12 bg-border" />
      </div>
    );
  };

  return (
    <footer className="py-12 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <div className="pt-8 border-t border-border">
          {renderDivider()}

          <p className={getNameClass()}>
            {brideName} &amp; {groomName}
          </p>

          <p className="text-muted-foreground text-sm mb-8">
            Thank you for being part of our special day.
          </p>

          <p className="text-xs text-muted-foreground">
            Made with{" "}
            <Heart className="w-3 h-3 inline text-primary fill-primary" /> for our
            wedding
          </p>
        </div>
      </div>
    </footer>
  );
}

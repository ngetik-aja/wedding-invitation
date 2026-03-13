"use client";

import { Heart } from "lucide-react";

interface FooterSectionProps {
  brideName: string;
  groomName: string;
  theme?: string;
}

export function FooterSection({ brideName, groomName, theme }: FooterSectionProps) {
  const isModern = theme === "modern";

  return (
    <footer className="py-12 px-6 text-center">
      <div className="max-w-xl mx-auto">
        {isModern ? (
          <div className="pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-border" />
              <div className="w-2 h-2 bg-primary" />
              <div className="h-px w-12 bg-border" />
            </div>

            <p className="font-sans font-light text-2xl md:text-3xl text-foreground tracking-[0.2em] uppercase mb-4">
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
        ) : (
          <div className="pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-border" />
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <div className="h-px w-12 bg-border" />
            </div>

            <p className="font-serif text-2xl md:text-3xl text-foreground mb-4">
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
        )}
      </div>
    </footer>
  );
}

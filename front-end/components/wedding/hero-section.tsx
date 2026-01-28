"use client";

import { Heart } from "lucide-react";

interface HeroSectionProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
  guestName?: string;
}

export function HeroSection({
  brideName,
  groomName,
  weddingDate,
  guestName,
}: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        {guestName && (
          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
              Dear
            </p>
            <p className="text-xl font-medium text-foreground">{guestName}</p>
          </div>
        )}

        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
          You are cordially invited to
        </p>

        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          The Wedding of
        </p>

        <div className="space-y-2 mb-8">
          <h1 className="font-serif text-5xl md:text-7xl font-medium text-foreground">
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-px w-12 bg-border" />
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <div className="h-px w-12 bg-border" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-medium text-foreground">
            {groomName}
          </h1>
        </div>

        <p className="font-serif text-xl md:text-2xl text-muted-foreground">
          {weddingDate}
        </p>
      </div>
    </section>
  );
}

"use client";

import { User } from "lucide-react";

interface PersonInfo {
  name: string;
  parentInfo: string;
  description?: string;
  imageUrl?: string;
}

interface CoupleSectionProps {
  bride: PersonInfo;
  groom: PersonInfo;
}

export function CoupleSection({ bride, groom }: CoupleSectionProps) {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Introducing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            The Happy Couple
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Bride */}
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shadow-sm">
              {bride.imageUrl ? (
                <img
                  src={bride.imageUrl || "/placeholder.svg"}
                  alt={bride.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-20 h-20 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
              {bride.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {bride.parentInfo}
            </p>
            {bride.description && (
              <p className="text-muted-foreground leading-relaxed">
                {bride.description}
              </p>
            )}
          </div>

          {/* Groom */}
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shadow-sm">
              {groom.imageUrl ? (
                <img
                  src={groom.imageUrl || "/placeholder.svg"}
                  alt={groom.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-20 h-20 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
              {groom.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {groom.parentInfo}
            </p>
            {groom.description && (
              <p className="text-muted-foreground leading-relaxed">
                {groom.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

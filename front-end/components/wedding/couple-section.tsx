"use client";

import { User } from "lucide-react";
import { ThemeSectionDivider } from "./theme-ornaments";

interface PersonInfo {
  name: string;
  parentInfo: string;
  description?: string;
  imageUrl?: string;
}

interface CoupleSectionProps {
  bride: PersonInfo;
  groom: PersonInfo;
  theme?: string;
}

export function CoupleSection({ bride, groom, theme }: CoupleSectionProps) {
  const isModern = theme === "modern";
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default

  const isElegant = !isModern && !isRustic && !isGold && !isTropical && !isFloral;
  const sectionBg = isModern ? "bg-card"
    : isGold ? "bg-primary/[0.04]"
    : isRustic ? "bg-secondary/30"
    : isTropical ? "bg-primary/[0.05]"
    : isFloral ? "bg-primary/[0.05]"
    : "bg-primary/[0.03]"; // elegant

  const getPhotoClass = () => {
    if (isModern)
      return "w-48 h-48 mx-auto mb-6 rounded-none bg-muted flex items-center justify-center overflow-hidden border-2 border-primary shadow-md";
    if (isRustic)
      return "w-48 h-48 mx-auto mb-6 rounded-xl border-2 border-primary/30 shadow-md bg-muted flex items-center justify-center overflow-hidden";
    if (isGold)
      return "w-48 h-48 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-4 ring-primary/40 ring-offset-4 ring-offset-card shadow-md";
    if (isTropical)
      return "w-48 h-48 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/50 shadow-md";
    if (isFloral)
      return "w-48 h-48 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-primary/30 ring-offset-4 ring-offset-card shadow-md";
    // elegant default
    return "w-48 h-48 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-primary/35 ring-offset-4 ring-offset-card shadow-md";
  };

  const getNameClass = () => {
    if (isModern)
      return "font-sans font-light text-2xl md:text-3xl text-foreground mb-2 tracking-wide uppercase";
    if (isRustic)
      return "font-serif text-2xl md:text-3xl text-foreground mb-2";
    if (isGold)
      return "font-serif font-semibold text-2xl md:text-3xl text-foreground mb-2";
    if (isTropical)
      return "font-sans font-medium text-2xl md:text-3xl text-foreground mb-2";
    if (isFloral)
      return "font-serif italic text-2xl md:text-3xl text-foreground mb-2";
    // elegant default
    return "font-serif font-medium text-2xl md:text-3xl text-foreground mb-2";
  };

  const getHeadingClass = () => {
    if (isModern)
      return "font-sans font-light text-4xl md:text-5xl text-foreground tracking-widest uppercase";
    if (isRustic)
      return "font-serif text-4xl md:text-5xl text-foreground";
    if (isGold)
      return "font-serif text-4xl md:text-5xl text-foreground";
    if (isTropical)
      return "font-sans text-4xl md:text-5xl text-foreground";
    if (isFloral)
      return "font-serif text-4xl md:text-5xl text-foreground";
    // elegant default
    return "font-serif text-4xl md:text-5xl text-foreground";
  };

  const photoClass = getPhotoClass();
  const nameClass = getNameClass();

  return (
    <section className={`py-20 px-6 ${sectionBg}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Introducing
          </p>
          <h2 className={getHeadingClass()}>
            The Happy Couple
          </h2>
          <ThemeSectionDivider theme={theme} />
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Bride */}
          <div className="text-center">
            <div className={photoClass}>
              {bride.imageUrl ? (
                <img src={bride.imageUrl} alt={bride.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-20 h-20 text-muted-foreground" />
              )}
            </div>
            <h3 className={nameClass}>{bride.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{bride.parentInfo}</p>
            {bride.description && (
              <p className="text-muted-foreground leading-relaxed">{bride.description}</p>
            )}
          </div>

          {/* Groom */}
          <div className="text-center">
            <div className={photoClass}>
              {groom.imageUrl ? (
                <img src={groom.imageUrl} alt={groom.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-20 h-20 text-muted-foreground" />
              )}
            </div>
            <h3 className={nameClass}>{groom.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{groom.parentInfo}</p>
            {groom.description && (
              <p className="text-muted-foreground leading-relaxed">{groom.description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

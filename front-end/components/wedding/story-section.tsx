"use client";

import { Heart, Leaf, Star } from "lucide-react";
import { ThemeSectionDivider } from "./theme-ornaments";

interface StoryItem {
  title: string;
  date: string;
  description: string;
}

interface StorySectionProps {
  stories: StoryItem[];
  theme?: string;
}

export function StorySection({ stories, theme }: StorySectionProps) {
  const isModern = theme === "modern";
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default

  if (!stories || stories.length === 0) return null;

  const getSectionBg = () => {
    if (isModern) return "py-20 px-6 bg-card";
    if (isGold) return "py-20 px-6 bg-primary/[0.04]";
    if (isRustic) return "py-20 px-6 bg-secondary/30";
    if (isTropical) return "py-20 px-6 bg-primary/[0.05]";
    if (isFloral) return "py-20 px-6 bg-primary/[0.05]";
    return "py-20 px-6 bg-primary/[0.03]"; // elegant
  };

  const getTimelineLineClass = () => {
    if (isModern) return "absolute left-4 top-0 h-full w-px bg-primary md:left-1/2";
    if (isRustic) return "absolute left-4 top-0 h-full border-l-2 border-dashed border-primary/30 md:left-1/2";
    if (isGold) return "absolute left-4 top-0 h-full w-px bg-primary/40 md:left-1/2";
    if (isTropical) return "absolute left-4 top-0 h-full w-px bg-primary/50 md:left-1/2";
    if (isFloral) return "absolute left-4 top-0 h-full w-px bg-primary/25 md:left-1/2";
    // elegant default
    return "absolute left-4 top-0 h-full w-px bg-primary/25 md:left-1/2";
  };

  const getDotClass = () => {
    if (isModern)
      return "absolute left-1.5 top-2 flex h-6 w-6 items-center justify-center bg-primary md:left-1/2 md:-translate-x-1/2";
    if (isGold)
      return "absolute left-1.5 top-2 flex h-6 w-6 items-center justify-center bg-primary rotate-45 md:left-1/2 md:-translate-x-1/2";
    // rustic, tropical, floral, elegant — all rounded-full
    return "absolute left-1.5 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-translate-x-1/2";
  };

  const getDotIcon = () => {
    if (isModern)
      return <span className="w-2 h-2 bg-primary-foreground block" />;
    if (isGold)
      return null;
    if (isRustic)
      return <Leaf className="h-3 w-3" />;
    if (isTropical)
      return <Star className="h-3 w-3" />;
    if (isFloral)
      return <span className="text-[10px] leading-none">✿</span>;
    // elegant default
    return <Heart className="h-3 w-3" />;
  };

  const getCardClass = () => {
    if (isModern) return "flex-1 rounded-none border border-border/60 bg-card shadow-sm p-6";
    if (isRustic) return "flex-1 rounded-xl border border-border/60 border-l-4 border-l-primary/40 bg-card shadow-sm p-6";
    if (isGold) return "flex-1 rounded-none border border-border/60 border-t-2 border-t-primary/50 bg-card shadow-sm p-6";
    if (isTropical) return "flex-1 rounded-2xl border border-border/60 bg-card shadow-sm p-6";
    if (isFloral) return "flex-1 rounded-3xl border border-border/60 bg-card shadow-sm p-6";
    // elegant — rose-tinted border + subtle left accent
    return "flex-1 rounded-2xl border border-primary/20 border-l-2 border-l-primary/40 bg-card shadow-sm p-6";
  };

  return (
    <section className={getSectionBg()}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Perjalanan Cinta
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Kisah Kami
          </h2>
          <ThemeSectionDivider theme={theme} />
          <p className="text-muted-foreground mt-3">
            Momen-momen penting yang membawa kami ke hari bahagia.
          </p>
        </div>

        <div className="relative">
          <div className={getTimelineLineClass()} />
          <div className="space-y-12">
            {stories.map((story, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={`${story.title}-${index}`}
                  className={`relative flex flex-col gap-6 md:flex-row ${isLeft ? "md:pr-10" : "md:flex-row-reverse md:pl-10"}`}
                >
                  <div className={getDotClass()}>
                    {getDotIcon()}
                  </div>
                  <div className={getCardClass()}>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {story.date || "Tanggal"}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-foreground">
                      {story.title || "Momen Spesial"}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {story.description || "Ceritakan momen ini dalam perjalanan cinta Anda."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

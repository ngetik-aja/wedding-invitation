"use client";

import { MessageCircle, Quote } from "lucide-react";
import { ThemeSectionDivider } from "./theme-ornaments";

interface Wish {
  name: string;
  message: string;
  date: string;
}

interface WishesSectionProps {
  wishes: Wish[];
  theme?: string;
}

export function WishesSection({ wishes, theme }: WishesSectionProps) {
  const isModern = theme === "modern";
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default

  const getSectionBg = () => {
    if (isModern) return "py-20 px-6";
    if (isGold) return "py-20 px-6 bg-primary/[0.02]";
    if (isRustic) return "py-20 px-6 bg-secondary/20";
    if (isTropical) return "py-20 px-6 bg-primary/[0.04]";
    if (isFloral) return "py-20 px-6 bg-primary/[0.04]";
    return "py-20 px-6 bg-primary/[0.02]"; // elegant
  };

  const getCardClass = () => {
    if (isModern)
      return "bg-card p-6 rounded-none border border-border border-l-4 border-l-primary shadow-sm";
    if (isRustic)
      return "bg-card p-6 rounded-xl border border-primary/20 border-l-4 border-l-primary/50 shadow-sm";
    if (isGold)
      return "bg-card p-6 rounded-none border border-primary/30 border-t-2 border-t-primary/60 shadow-sm";
    if (isTropical)
      return "bg-card p-6 rounded-2xl border border-primary/25 shadow-sm";
    if (isFloral)
      return "bg-card p-6 rounded-3xl border border-primary/15 shadow-sm";
    // elegant — rose border with prominent left accent
    return "bg-card p-6 rounded-xl border border-primary/20 border-l-2 border-l-primary/50 shadow-sm";
  };

  return (
    <section className={getSectionBg()}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Words of Love
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Wedding Wishes
          </h2>
          <ThemeSectionDivider theme={theme} />
        </div>

        {wishes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Be the first to send your wishes!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {wishes.map((wish, index) => (
              <div
                key={index}
                className={getCardClass()}
              >
                <Quote className="w-6 h-6 text-primary/40 mb-3" />
                <p className="text-foreground leading-relaxed mb-4">
                  {wish.message}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="font-medium text-foreground">{wish.name}</p>
                  <p className="text-xs text-muted-foreground">{wish.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

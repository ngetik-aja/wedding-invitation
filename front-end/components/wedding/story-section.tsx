"use client";

import { Heart } from "lucide-react";

interface StoryItem {
  title: string;
  date: string;
  description: string;
}

interface StorySectionProps {
  stories: StoryItem[];
}

export function StorySection({ stories }: StorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Perjalanan Cinta
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Kisah Kami
          </h2>
          <p className="text-muted-foreground mt-3">
            Momen-momen penting yang membawa kami ke hari bahagia.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2" />
          <div className="space-y-12">
            {stories.map((story, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={`${story.title}-${index}`}
                  className={`relative flex flex-col gap-6 md:flex-row ${isLeft ? "md:pr-10" : "md:flex-row-reverse md:pl-10"}`}
                >
                  <div className="absolute left-1.5 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-translate-x-1/2">
                    <Heart className="h-3 w-3" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
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

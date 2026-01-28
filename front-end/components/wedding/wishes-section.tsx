"use client";

import { MessageCircle, Quote } from "lucide-react";

interface Wish {
  name: string;
  message: string;
  date: string;
}

interface WishesSectionProps {
  wishes: Wish[];
}

export function WishesSection({ wishes }: WishesSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Words of Love
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Wedding Wishes
          </h2>
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
                className="bg-card p-6 rounded-lg border border-border shadow-sm"
              >
                <Quote className="w-6 h-6 text-primary/30 mb-3" />
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

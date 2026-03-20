"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSectionDivider } from "./theme-ornaments";

interface EventInfo {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl?: string;
}

interface EventSectionProps {
  events: EventInfo[];
  theme?: string;
}

export function EventSection({ events, theme }: EventSectionProps) {
  const isModern = theme === "modern";
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default

  const getSectionBg = () => {
    if (isModern) return "py-20 px-6";
    if (isGold) return "py-20 px-6 bg-primary/[0.04]";
    if (isRustic) return "py-20 px-6 bg-secondary/20";
    if (isTropical) return "py-20 px-6 bg-primary/[0.04]";
    if (isFloral) return "py-20 px-6 bg-primary/[0.04]";
    return "py-20 px-6 bg-primary/[0.02]"; // elegant — subtle warmth between sections
  };

  const getCardClass = () => {
    if (isModern) return "bg-card p-8 rounded-none border border-border shadow-sm";
    if (isRustic) return "bg-card p-8 rounded-xl border border-primary/25 shadow-sm";
    if (isGold) return "bg-card p-8 rounded-none border border-primary/40 border-t-4 border-t-primary/50 shadow-sm";
    if (isTropical) return "bg-card p-8 rounded-2xl border border-primary/30 shadow-sm";
    if (isFloral) return "bg-card p-8 rounded-3xl border border-primary/20 shadow-sm";
    // elegant — rose-tinted border
    return "bg-card p-8 rounded-2xl border border-primary/20 shadow-sm";
  };

  const getIconCircleClass = (shrink = false) => {
    const shrinkClass = shrink ? " shrink-0" : "";
    if (isModern)
      return `w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center${shrinkClass}`;
    if (isRustic)
      return `w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center${shrinkClass}`;
    if (isGold)
      return `w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center${shrinkClass}`;
    // tropical, floral, elegant default
    return `w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center${shrinkClass}`;
  };

  const getEventTitleClass = () => {
    if (isGold) return "font-serif text-xl text-foreground mb-6 text-center tracking-wider uppercase";
    return "font-serif text-2xl text-foreground mb-6 text-center";
  };

  return (
    <section className={getSectionBg()}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Mark Your Calendar
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Wedding Events
          </h2>
          <ThemeSectionDivider theme={theme} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className={getCardClass()}
            >
              <h3 className={getEventTitleClass()}>
                {event.title}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={getIconCircleClass()}>
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Date
                    </p>
                    <p className="text-foreground font-medium">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={getIconCircleClass()}>
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Time
                    </p>
                    <p className="text-foreground font-medium">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={getIconCircleClass(true)}>
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Venue
                    </p>
                    <p className="text-foreground font-medium">{event.venue}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.address}
                    </p>
                  </div>
                </div>
              </div>

              {event.mapUrl && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open(event.mapUrl, "_blank")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Open in Maps
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

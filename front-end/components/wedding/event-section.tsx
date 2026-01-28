"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

export function EventSection({ events }: EventSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Mark Your Calendar
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Wedding Events
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg border border-border shadow-sm"
            >
              <h3 className="font-serif text-2xl text-foreground mb-6 text-center">
                {event.title}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
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
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
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
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
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

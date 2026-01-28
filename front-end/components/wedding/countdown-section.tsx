"use client";

import { useEffect, useState } from "react";

interface CountdownSectionProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownSection({ targetDate }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
          Counting Down To
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-12">
          Our Special Day
        </h2>

        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="bg-background border border-border rounded-lg p-4 md:p-6 shadow-sm">
                <span className="font-serif text-3xl md:text-5xl text-foreground">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-xs md:text-sm uppercase tracking-wider text-muted-foreground">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

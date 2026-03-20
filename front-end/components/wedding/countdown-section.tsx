"use client";

import { useEffect, useState } from "react";
import { ThemeSectionDivider } from "./theme-ornaments";

interface CountdownSectionProps {
  targetDate: Date;
  theme?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownSection({ targetDate, theme }: CountdownSectionProps) {
  const isModern = theme === "modern";
  const isRustic = theme === "rustic";
  const isGold = theme === "gold";
  const isTropical = theme === "tropical";
  const isFloral = theme === "floral";
  // elegant is the default

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

  const getCardClass = () => {
    if (isModern) return "bg-primary p-4 md:p-7";
    if (isRustic) return "bg-secondary/50 border border-primary/25 rounded-xl p-4 md:p-7";
    if (isGold) return "border-2 border-primary/60 bg-primary/[0.08] p-4 md:p-7";
    if (isTropical) return "bg-accent/25 rounded-xl p-4 md:p-7";
    if (isFloral) return "bg-primary/15 rounded-3xl border border-primary/20 p-4 md:p-7";
    // elegant default
    return "bg-primary/25 rounded-2xl p-4 md:p-7";
  };

  const getNumberClass = () => {
    if (isModern) return "font-sans font-light text-4xl md:text-6xl tracking-tighter text-primary-foreground block";
    if (isRustic) return "font-serif text-4xl md:text-6xl text-foreground block";
    if (isGold) return "font-serif text-4xl md:text-6xl text-primary font-semibold block";
    if (isTropical) return "font-sans font-medium text-4xl md:text-6xl text-foreground block";
    if (isFloral) return "font-serif text-4xl md:text-6xl text-primary block";
    // elegant default
    return "font-serif text-4xl md:text-6xl text-primary block";
  };

  const getLabelClass = () => {
    if (isModern) return "mt-3 text-xs uppercase text-muted-foreground tracking-[0.25em]";
    return "mt-3 text-xs uppercase text-muted-foreground tracking-wider";
  };

  const getSectionBg = () => {
    if (isModern) return "py-20 px-6 bg-card";
    if (isGold) return "py-20 px-6 bg-primary/[0.04]";
    if (isRustic) return "py-20 px-6 bg-secondary/30";
    if (isTropical) return "py-20 px-6 bg-primary/[0.05]";
    if (isFloral) return "py-20 px-6 bg-primary/[0.05]";
    return "py-20 px-6 bg-primary/[0.03]"; // elegant
  };

  return (
    <section className={getSectionBg()}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
          Counting Down To
        </p>
        <h2 className={`font-serif text-4xl md:text-5xl text-foreground mb-4${isGold ? " tracking-widest" : ""}`}>
          Our Special Day
        </h2>
        <ThemeSectionDivider theme={theme} className="mb-8" />

        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="text-center">
              <div className={getCardClass()}>
                <span className={getNumberClass()}>
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <p className={getLabelClass()}>
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

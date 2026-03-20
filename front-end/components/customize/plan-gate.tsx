"use client";

import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanCode, PlanLimits } from "@/lib/hooks/use-customer-plan";

type GatedFeature = "music" | "love_story" | "gifts" | "custom_domain";

interface PlanGateProps {
  feature: GatedFeature;
  planLimits: PlanLimits;
  planCode: PlanCode;
  children: React.ReactNode;
}

function isFeatureLocked(feature: GatedFeature, planLimits: PlanLimits): boolean {
  switch (feature) {
    case "music":
      return !planLimits.music;
    case "love_story":
      return !planLimits.love_story;
    case "gifts":
      return !planLimits.gifts;
    case "custom_domain":
      return !planLimits.custom_domain;
    default:
      return false;
  }
}

function planCodeLabel(planCode: PlanCode): string {
  switch (planCode) {
    case "basic":
      return "Basic";
    case "premium":
      return "Premium";
    case "exclusive":
      return "Exclusive";
    default:
      return "Gratis";
  }
}

function upgradeLabel(planCode: PlanCode): string {
  if (planCode === "none" || planCode === "basic") {
    return "Upgrade ke Premium";
  }
  return "Upgrade ke Exclusive";
}

export function PlanGate({ feature, planLimits, planCode, children }: PlanGateProps) {
  const locked = isFeatureLocked(feature, planLimits);

  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred children */}
      <div className="filter blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-background/60 backdrop-blur-[2px] z-10 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-border">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Fitur Terkunci</p>
          <p className="text-sm text-muted-foreground">
            Fitur ini tidak tersedia di paket{" "}
            <span className="font-medium text-foreground">{planCodeLabel(planCode)}</span>
          </p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/pricing">
            {upgradeLabel(planCode)}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
